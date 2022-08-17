export default (snake: string): string => snake.replace(/[^a-zA-Z0-9]+(.)/g, (x, y) => y.toUpperCase());

