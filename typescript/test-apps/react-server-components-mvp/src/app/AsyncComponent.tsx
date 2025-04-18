const getData = async () => {
  return new Promise<string[]>((resolve) => {
    setTimeout(() => {
      resolve(["apple", "banana", "cherry"]);
    }, 3000);
  });
};

export const AsyncComponent = async () => {
  const data = await getData();
  console.log("???");

  return (
    <ul>
      {data.map((cell) => {
        return (
          <li key={cell}>
            <div>{cell}</div>
          </li>
        );
      })}
    </ul>
  );
};
