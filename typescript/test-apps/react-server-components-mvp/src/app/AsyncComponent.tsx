const getData = async () => {
  return new Promise<string[]>((resolve) => {
    setTimeout(() => {
      resolve(["apple", "banana", "cherry"]);
    }, 3000);
  });
};

const getData2 = async () => {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve("This was streamed later");
    }, 5000);
  });
};

export const AsyncComponent = async () => {
  const data = await getData();
  console.log("???");

  return (
    <div>
      <h2>I am being streamed</h2>
      <ul>
        {data.map((cell) => {
          return (
            <li key={cell}>
              <div>{cell}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export const AsyncComponent2 = async () => {
  const data2 = await getData2();
  console.log("!!!");

  return <h4>{data2}</h4>;
};
