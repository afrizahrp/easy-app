const GenerateSlug = (text: string, maxLength: number = 50): string => {
  return text
    .toLowerCase()
    .normalize('NFD') // Normalize Unicode characters (e.g., É → E)
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics (e.g., accents)
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading and trailing hyphens
    .slice(0, maxLength) // Limit slug length
}

export default GenerateSlug
