import FileSaver from 'file-saver';

export const surpriseMePrompts = [
  // ... your prompts
];

export const getRandomPrompts = (prompt) => {
  const randomIndex = Math.floor(Math.random() * surpriseMePrompts.length);
  const randomPrompt = surpriseMePrompts[randomIndex];

  if (randomPrompt === prompt) return getRandomPrompts(prompt);

  return randomPrompt;
};

export const downloadImage = async (_id, photo) => {
  FileSaver.saveAs(photo, `download-${_id}.jpg`);
};