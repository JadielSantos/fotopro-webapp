export async function handleDatabaseOperation(operation: any) {
  try {
    return await operation();
  } catch (error) {
    console.error("Database operation failed:", error);
    throw error;
  }
}
