export interface ValidationError {
  field: string
  message: string
}

export function validateRequired(value: unknown, fieldName: string): ValidationError | null {
  if (value === undefined || value === null || value === "") {
    return { field: fieldName, message: `${fieldName} is required` }
  }
  return null
}

export function validateString(
  value: unknown,
  fieldName: string,
  options?: { minLength?: number; maxLength?: number; pattern?: RegExp }
): ValidationError | null {
  if (typeof value !== "string") {
    return { field: fieldName, message: `${fieldName} must be a string` }
  }

  if (options?.minLength && value.length < options.minLength) {
    return {
      field: fieldName,
      message: `${fieldName} must be at least ${options.minLength} characters`,
    }
  }

  if (options?.maxLength && value.length > options.maxLength) {
    return {
      field: fieldName,
      message: `${fieldName} must be at most ${options.maxLength} characters`,
    }
  }

  if (options?.pattern && !options.pattern.test(value)) {
    return { field: fieldName, message: `${fieldName} format is invalid` }
  }

  return null
}

export function validateNumber(
  value: unknown,
  fieldName: string,
  options?: { min?: number; max?: number; integer?: boolean }
): ValidationError | null {
  const num = Number(value)

  if (isNaN(num)) {
    return { field: fieldName, message: `${fieldName} must be a number` }
  }

  if (options?.integer && !Number.isInteger(num)) {
    return { field: fieldName, message: `${fieldName} must be an integer` }
  }

  if (options?.min !== undefined && num < options.min) {
    return {
      field: fieldName,
      message: `${fieldName} must be at least ${options.min}`,
    }
  }

  if (options?.max !== undefined && num > options.max) {
    return {
      field: fieldName,
      message: `${fieldName} must be at most ${options.max}`,
    }
  }

  return null
}

export function validateEmail(value: unknown, fieldName: string): ValidationError | null {
  if (typeof value !== "string") {
    return { field: fieldName, message: `${fieldName} must be a string` }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(value)) {
    return { field: fieldName, message: `${fieldName} must be a valid email` }
  }

  return null
}

export function validateDate(value: unknown, fieldName: string): ValidationError | null {
  if (typeof value !== "string") {
    return { field: fieldName, message: `${fieldName} must be a string` }
  }

  const date = new Date(value)
  if (isNaN(date.getTime())) {
    return { field: fieldName, message: `${fieldName} must be a valid date` }
  }

  return null
}

export function validatePickupInput(data: Record<string, unknown>): ValidationError[] {
  const errors: ValidationError[] = []

  const requiredFields = ["category", "deviceName", "availableFrom", "availableTo", "timeSlot", "address"]
  for (const field of requiredFields) {
    const error = validateRequired(data[field], field)
    if (error) errors.push(error)
  }

  if (data.category) {
    const error = validateString(data.category, "category", { maxLength: 100 })
    if (error) errors.push(error)
  }

  if (data.deviceName) {
    const error = validateString(data.deviceName, "deviceName", { maxLength: 200 })
    if (error) errors.push(error)
  }

  if (data.quantity !== undefined) {
    const error = validateNumber(data.quantity, "quantity", { min: 1, max: 100, integer: true })
    if (error) errors.push(error)
  }

  if (data.availableFrom) {
    const error = validateDate(data.availableFrom, "availableFrom")
    if (error) errors.push(error)
  }

  if (data.availableTo) {
    const error = validateDate(data.availableTo, "availableTo")
    if (error) errors.push(error)
  }

  if (data.availableFrom && data.availableTo && typeof data.availableFrom === "string" && typeof data.availableTo === "string") {
    if (data.availableTo < data.availableFrom) {
      errors.push({ field: "availableTo", message: "availableTo must be on or after availableFrom" })
    }
  }

  if (data.address) {
    const error = validateString(data.address, "address", { maxLength: 500 })
    if (error) errors.push(error)
  }

  if (data.notes && typeof data.notes === "string") {
    const error = validateString(data.notes, "notes", { maxLength: 1000 })
    if (error) errors.push(error)
  }

  return errors
}

export function validateSearchFilters(data: Record<string, unknown>): ValidationError[] {
  const errors: ValidationError[] = []

  if (data.query && typeof data.query === "string") {
    const error = validateString(data.query, "query", { maxLength: 200 })
    if (error) errors.push(error)
  }

  if (data.status && !Array.isArray(data.status)) {
    errors.push({ field: "status", message: "status must be an array" })
  }

  if (data.categories && !Array.isArray(data.categories)) {
    errors.push({ field: "categories", message: "categories must be an array" })
  }

  if (data.page !== undefined) {
    const error = validateNumber(data.page, "page", { min: 1, integer: true })
    if (error) errors.push(error)
  }

  if (data.limit !== undefined) {
    const error = validateNumber(data.limit, "limit", { min: 1, max: 50, integer: true })
    if (error) errors.push(error)
  }

  return errors
}
