const fetchId = async (id: string) => {
  const post = await fetch(`http://localhost:3003/api/${id}`, {
    method: "GET",
    next: {
      revalidate: 60000,
    },
  });

  return post.json();
};

export const generateMetadata = async ({ params }: any) => {
  const { id } = params;
  const data = await fetchId(id);
  const { hello } = data;

  return {
    title: hello,
  };
};

export default function Id({ params, searchParams }: any) {
  const { id } = params;
  const { test } = searchParams;
  console.log(test);

  return (
    <div>
      <div>{id}</div>
    </div>
  );
}
