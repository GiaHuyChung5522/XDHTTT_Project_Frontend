// API Client - Skeleton for testing
// TODO: Replace with real axios client later

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const apiClient = {
  get: async (url: string) => {
    await delay(300);
    console.log(`GET ${url}`);
    return { success: true, data: [] };
  },
  
  post: async (url: string, data: any) => {
    await delay(300);
    console.log(`POST ${url}`, data);
    return { success: true, data: { id: Date.now(), ...data } };
  },
  
  put: async (url: string, data: any) => {
    await delay(300);
    console.log(`PUT ${url}`, data);
    return { success: true, data };
  },
  
  delete: async (url: string) => {
    await delay(300);
    console.log(`DELETE ${url}`);
    return { success: true };
  }
};
