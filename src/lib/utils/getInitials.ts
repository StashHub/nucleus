/**
 * @description Generate a string of initials given a first and/or last name
 */
export function getInitials(name: string): string {
  const names = name.split(" ");
  const firstName = names[0];
  const lastName = names.length - 1 === 0 ? undefined : names[names.length - 1];
  if (firstName && lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }
  if (firstName) return firstName.charAt(0).toUpperCase();
  return "IR";
}
