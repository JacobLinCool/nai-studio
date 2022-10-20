# NAI Studio

NovelAI Library and Command Line Interface.

> DISCLAIMER: This is not an official NovelAI product. This is a community project.

```sh
NOVEL_AI_TOKEN=YOUR_TOKEN nai "school uniform, purple eyes" -n "nsfw" -w 640 -h 640
```

> You can also save your token in the `.env` file, it will be loaded automatically.

```ts
import { NovelAI, resolution } from "nai-studio";
import fs from "node:fs";

(async () => {
    const nai = new NovelAI("YOUR_TOKEN");
    const image = await nai.image("prompt", "", { ...resolution.normal.portrait });
    fs.writeFileSync("image.png", image);
})();
```
