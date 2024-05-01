export const emailNormalizer: (identifier: string) => string = (identifier) => {
  const [local, domain] = identifier.toLowerCase().trim().split("@");
  const normalizedDomain = domain?.split(",")[0];
  return `${local}@${normalizedDomain}`;
};
