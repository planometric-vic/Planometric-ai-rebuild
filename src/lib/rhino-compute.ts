import axios from 'axios';
import FormData from 'form-data';

const RHINO_COMPUTE_URL = process.env.RHINO_COMPUTE_URL || 'http://localhost:8081';
const RHINO_COMPUTE_API_KEY = process.env.RHINO_COMPUTE_API_KEY;
const GRASSHOPPER_DEFINITION_PATH = process.env.GRASSHOPPER_DEFINITION_PATH;

export interface ProjectInputs {
  projectNumber: string;
  projectName: string;
  northOrientation: number;
  localCouncil: string;
  planningZone: string;
}

export interface RhinoComputeResult {
  plansPdf: Buffer;
  invoicePdf: Buffer;
}

/**
 * Sends a CAD file and project inputs to Rhino Compute for processing
 * Returns the generated PDF plans and invoice
 */
export async function processWithRhinoCompute(
  cadFileBuffer: Buffer,
  cadFileName: string,
  inputs: ProjectInputs
): Promise<RhinoComputeResult> {
  try {
    const formData = new FormData();

    // Add the CAD file
    formData.append('file', cadFileBuffer, {
      filename: cadFileName,
      contentType: cadFileName.endsWith('.dwg')
        ? 'application/acad'
        : 'application/octet-stream',
    });

    // Add project inputs as JSON
    formData.append('inputs', JSON.stringify(inputs));

    // Add grasshopper definition path
    if (GRASSHOPPER_DEFINITION_PATH) {
      formData.append('definition', GRASSHOPPER_DEFINITION_PATH);
    }

    const headers: Record<string, string> = {
      ...formData.getHeaders(),
    };

    if (RHINO_COMPUTE_API_KEY) {
      headers['RhinoComputeKey'] = RHINO_COMPUTE_API_KEY;
    }

    // Call Rhino Compute endpoint
    const response = await axios.post(
      `${RHINO_COMPUTE_URL}/grasshopper`,
      formData,
      {
        headers,
        responseType: 'json',
        timeout: 300000, // 5 minute timeout for processing
      }
    );

    // The response should contain URLs or base64 encoded PDFs
    // This is a simplified version - adjust based on your actual Rhino Compute setup
    const { plansPdfBase64, invoicePdfBase64 } = response.data;

    return {
      plansPdf: Buffer.from(plansPdfBase64, 'base64'),
      invoicePdf: Buffer.from(invoicePdfBase64, 'base64'),
    };
  } catch (error) {
    console.error('Rhino Compute processing error:', error);
    throw new Error('Failed to process file with Rhino Compute');
  }
}

/**
 * Check if Rhino Compute service is available
 */
export async function checkRhinoComputeHealth(): Promise<boolean> {
  try {
    const response = await axios.get(`${RHINO_COMPUTE_URL}/healthcheck`, {
      timeout: 5000,
    });
    return response.status === 200;
  } catch (error) {
    console.error('Rhino Compute health check failed:', error);
    return false;
  }
}
