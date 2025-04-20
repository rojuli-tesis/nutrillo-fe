export const getTimeBasedGreeting = (name: string): string => {
  const hour = new Date().getHours();

  let greeting = '';
  if (hour >= 5 && hour < 12) {
    greeting = 'Buenos días';
  } else if (hour >= 12 && hour < 20) {
    greeting = 'Buenas tardes';
  } else {
    greeting = 'Buenas noches';
  }
  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
  return `${greeting}, ${capitalizedName}`;
}; 