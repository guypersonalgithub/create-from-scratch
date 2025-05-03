type CountLineArgs = {
  str: string;
};

export const countLines = ({ str }: CountLineArgs) => {
  if (str === "") {
    return 0;
  }
  
  return str.split(/\r\n|\r|\n/).length;
};
