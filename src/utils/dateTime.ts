// src/utils/dateTime.ts

// Esta função retorna a data atual no formato ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)
// que é o formato que o Django espera para campos DateTimeField.
export const timezone = {
    now: () => new Date().toISOString(),
};