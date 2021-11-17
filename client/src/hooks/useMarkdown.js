import { useState, useEffect } from "react";

export default function useMarkdown(fileContent) {
  const [markdown, setMarkdown] = useState(null);

  useEffect(() => {
    (async function getMarkdown() {
      const response = await fetch(fileContent);
      const text = await response.text();
      setMarkdown(text);
    })();
  });

  return markdown;
}
