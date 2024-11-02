---
theme: default
aspectRatio: 16/9
# real width of the canvas, unit in px
canvasWidth: 980

background: https://cover.sli.dev
title: Generative AI For The Rest Of Us
info: |
  ## Lets build a better web together.
  Learn more at [Sli.dev](https://sli.dev)
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
overviewSnapshots: true
---

# Generative AI For The Rest Of Us(plebs)

Nzai Kilonzo

<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
    Press Space for next page <carbon:arrow-right class="inline"/>
  </span>
</div>

<div class="abs-br m-6 flex gap-2">
  <button @click="$slidev.nav.openInEditor()" title="Open in Editor" class="text-xl slidev-icon-btn opacity-50 !border-none !hover:text-white">
    <carbon:edit />
  </button>
  <a href="https://github.com/mundume" target="_blank" alt="GitHub" title="Open in GitHub"
    class="text-xl slidev-icon-btn opacity-50 !border-none !hover:text-white">
    <carbon-logo-github />
  </a>
</div>

<!--
Welcome everyone! Today we'll explore the practical applications of generative AI for everyday developers.
-->

---

# Nzai Kilonzo

Junior Dev For Life.

<div class="leading-8 opacity-80">I build cool shit <br>
Big fan of The lord of the rings(and yes The Rings Of Power is Trash)<br>
</div>

<div class="abs-br m-6 flex gap-2">
  <a href="https:x.com/nzai__" target="_blank" alt="GitHub" title="Open in X" class="text-xl slidev-icon-btn opacity-50 !border-none !hover:text-white">
    <carbon:logo-x />
  </a>
  <a href="https://github.com/mundume" target="_blank" alt="GitHub" title="Open in GitHub"
    class="text-xl slidev-icon-btn opacity-50 !border-none !hover:text-white">
    <carbon-logo-github />
  </a>
</div>

<!--
A brief introduction about myself and my mission to make AI more accessible to developers of all skill levels.
-->

---

# Why This Talk / Mini-Workshop?

- Have fun.
- Practical, hands-on learning.
- Build something by the end of the talk

<!--
Let's break down AI development into approachable, practical steps that everyone can understand and implement.
-->

---

# What We'll Cover

- Generative AI Basics
- Next.js Integration using the vercel AI SDK.
- Working with vision LLM models and text models.
- How to write good prompts.
- RAG(Retrieval Augmented Generation)
- Real-world Examples
- Practical Tips

::right::

<div class="ml-4">

## You'll Learn:

- Setting up AI in your apps using the Vercel AI SDK
- Working with AI responses
- Fine-tuning LLM models to return better results.
- Managing AI states.
- Best practices

</div>

<!--
We'll focus on practical, hands-on learning that you can apply to your projects right away.
-->

---

# Prerequisites

- Nothing, Just smile.

<!--
You can have `style` tag in markdown to override the style for the current page.
Learn more: https://sli.dev/features/slide-scope-style
-->

<style>

</style>

<!--
Here is another comment.
-->

---

# What are you going to build then?

<div class="flex items-center gap-4 text-2xl text-emerald-300">
A wireframe or a screenshot to  a Expo react native app with an embedded chat to further experimenting on the design (ghetto V0)
</div>

---

# The Stack

- Next.js v14(app router)
- Tailwindcss(using the goated Shadcn UI)
- Vercel AI SDK
- Llama 3.2 vision 90B(served through groq)
- Llama 3.2 text 90B(served through groq)
- Expo snack sdk for live preview

---

# Why the Stack?

- React(i mean its react)
- Edge runtime
- The app router is so cool
- The vercel AI SDK is so powerful and easy to use.
- Groq is free and fast(only cohere is faster).

---

### The Basics.

#### Generate Text

<div class="text-sm">
You can generate text using the <span class="font-bold text-emerald-300">generateText</span> function. This function is ideal for non-interactive use cases where you need to write text (e.g. drafting email or summarizing web pages) and for agents that use tools.
</div>

````md magic-move {lines: true}
```tsx
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const { text } = await generateText({
    model: openai("gpt-4"),
    system: "You are a helpful assistant.",
    prompt,
  });

  return Response.json({ text });
}
```

```tsx
import { useState } from "react";

export default function Page() {
  const [generation, setGeneration] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <div
        onClick={async () => {
          setIsLoading(true);

          await fetch("/api/completion", {
            method: "POST",
            body: JSON.stringify({
              prompt: "Why is the sky blue?",
            }),
          }).then((response) => {
            response.json().then((json) => {
              setGeneration(json.text);
              setIsLoading(false);
            });
          });
        }}
      >
        Generate
      </div>

      {isLoading ? "Loading..." : generation}
    </div>
  );
}
```
````

---

## StreamText

<div class="text-sm">
Depending on your model and prompt, it can take a large language model (LLM) up to a minute to finish generating it's response. This delay can be unacceptable for interactive use cases such as chatbots or real-time applications, where users expect immediate responses.
AI SDK Core provides the streamText function which simplifies streaming text from LLMs
</div>

````md magic-move {lines: true}
```ts
import { streamText } from "ai";
import { groq } from "@ai-sdk/groq";

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const result = await streamText({
    model: groq("llama-3-70B-versatile"),
    system: "You are a helpful assistant.",
    prompt,
  });

  return result.toDataStreamResponse();
}
```

```tsx
import { useCompletion } from "ai/react";

export default function Page() {
  const { completion, complete } = useCompletion({
    api: "/api/completion",
  });

  return (
    <div>
      <div
        onClick={async () => {
          await complete("Why is the sky blue?");
        }}
      >
        Generate
      </div>

      {completion}
    </div>
  );
}
```
````

---

## GenerateObject

<div class="text-sm">
The generateObject generates structured data from a prompt. The schema is also used to validate the generated data, ensuring type safety and correctness.
</div>

````md magic-move {lines: true}
```ts
// Generate Object - generate Objects from a zod schema
import { generateObject } from "ai";
import { groq } from "@ai-sdk/groq";
import { z } from "zod";

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const result = await generateObject({
    model: groq("llama-3-70B-versatile"),
    system: "You generate three notifications for a messages app.",
    prompt,
    schema: z.object({
      notifications: z.array(
        z.object({
          name: z.string().describe("Name of a fictional person."),
          message: z.string().describe("Do not use emojis or links."),
          minutesAgo: z.number(),
        })
      ),
    }),
  });

  return result.toJsonResponse();
}
```

```tsx
import { useState } from "react";

export default function Page() {
  const [generation, setGeneration] = useState();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <div
        onClick={async () => {
          setIsLoading(true);

          await fetch("/api/completion", {
            method: "POST",
            body: JSON.stringify({
              prompt: "Messages during finals week.",
            }),
          }).then((response) => {
            response.json().then((json) => {
              setGeneration(json.object);
              setIsLoading(false);
            });
          });
        }}
      >
        Generate
      </div>

      {isLoading ? "Loading..." : <pre>{JSON.stringify(generation)}</pre>}
    </div>
  );
}
```
````

---

### StreamObject

<div class="text-sm">
The streamObject generates structured data from a prompt. The schema is also used to validate the generated data, ensuring type safety and correctness.
</div>

````md magic-move {lines: true}
```ts
// Generate Object - generate Objects from a zod schema

import { groq } from "@ai-sdk/groq";
import { streamObject } from "ai";
import { notificationSchema } from "./schema";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const context = await req.json();

  const result = await streamObject({
    model: groq("llama-3-70B-versatile"),
    schema: notificationSchema,
    prompt:
      `Generate 3 notifications for a messages app in this context:` + context,
  });

  return result.toTextStreamResponse();
}
```

```tsx
"use client";

import { experimental_useObject as useObject } from "ai/react";
import { notificationSchema } from "./api/use-object/schema";

export default function Page() {
  const { object, submit } = useObject({
    api: "/api/use-object",
    schema: notificationSchema,
  });

  return (
    <div>
      <button onClick={() => submit("Messages during finals week.")}>
        Generate notifications
      </button>

      {object?.notifications?.map((notification, index) => (
        <div key={index}>
          <p>{notification?.name}</p>
          <p>{notification?.message}</p>
        </div>
      ))}
    </div>
  );
}
```
````

---

# Tools

A `tool` is a function that can be called by the model to perform a specific task. You can think of a tool like a program you give to the model that it can run as and when it deems necessary.
A tool usually has 3 elements

- description - a short description of what the tool does
- parameters - a schema for the parameters that the tool takes
- execute - the function that the tool runs

---

## Tool Example

```ts {1-3|7-17|all}
import { generateText, tool } from "ai";
import { groq } from "@ai-sdk/groq";

const { text } = await generateText({
  model: groq("llama-3.1-70b-versatile"),
  prompt: "What is the weather like today?",
  tools: {
    weather: tool({
      description: "Get the weather in a location",
      parameters: z.object({
        location: z.string().describe("The location to get the weather for"),
      }),
      execute: async ({ location }) => ({
        location,
        temperature: 72 + Math.floor(Math.random() * 21) - 10,
      }),
    }),
  },
});
```

<!--
we duuh
-->

---

# RAG(Retrieval Augmented Generation)

## What is RAG?

RAG stands for retrieval augmented generation. In simple terms, RAG is the process of providing a Large Language Model (LLM) with specific information relevant to the prompt.

## Why is RAG important?

While LLMs are powerful, the information they can reason on is restricted to the data they were trained on. This problem becomes apparent when asking an LLM for information outside of their training data, like proprietary data or common knowledge that has occurred after the model’s training cutoff. RAG solves this problem by fetching information relevant to the prompt and then passing that to the model as context.

---

# Basic RAG Example(Dont ever do this )

```ts
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const result = await streamText({
    model: openai("gpt-4"),
    system: `You are a helpful assistant. If the user asks you anything about love and relationships, you will respond with \baby dont hurt me no more\n\ You can use your own intuition on other things blud.`,

    prompt,
  });

  return result.toDataStreamResponse();
}
```

---

# RAG BEST PRACTICES

- Avoid asking for information outside of your training data.
- Use a vector database to store information relevant to the prompt.
- Use similarity search using embeddings for efficiency.

I

---

# Generative UI

The RSC API allows you to stream React components from the server to the client with the streamUI function. This is useful when you want to go beyond raw text and stream components to the client in real-time

````md magic-move {lines: true}
```ts
'use server';

import { streamUI } from 'ai/rsc';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

const LoadingComponent = () => (
  <div className="animate-pulse p-4">getting weather...</div>
);

const getWeather = async (location: string) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return '82°F️ ☀️';
};

interface WeatherProps {
  location: string;
  weather: string;
}

const WeatherComponent = (props: WeatherProps) => (
  <div className="border border-neutral-200 p-4 rounded-lg max-w-fit">
    The weather in {props.location} is {props.weather}
  </div>
);

export async function streamComponent() {
  const result = await streamUI({
    model: openai('gpt-4o'),
    prompt: 'Get the weather for San Francisco',
    text: ({ content }) => <div>{content}</div>,
    tools: {
      getWeather: {
        description: 'Get the weather for a location',
        parameters: z.object({
          location: z.string(),
        }),
        generate: async function* ({ location }) {
          yield <LoadingComponent />;
          const weather = await getWeather(location);
          return <WeatherComponent weather={weather} location={location} />;
        },
      },
    },
  });

  return result.value;
}
```

```ts
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { streamComponent } from './actions';

export default function Page() {
  const [component, setComponent] = useState<React.ReactNode>();

  return (
    <div>
      <form
        onSubmit={async e => {
          e.preventDefault();
          setComponent(await streamComponent());
        }}
      >
        <Button>Stream Component</Button>
      </form>
      <div>{component}</div>
    </div>
  );
}
```
````

---

# DEMO TIME

### Basic DEMO

 <div>
 <h1 class="text-2xl font-bold text-emerald-300">
 Simple introduction to the Vercel AI SDK  and a few demos
 </h1>
 </div>

### Real World Problem Solving demo

<h1 class="text-2xl font-bold text-emerald-300">
I have been working on a wanabee v0 like app for expo react native and i think that would be a nice app for all of us to learn and play with which were going to build together
</h1>

---

# Thanks for coming to my talk

---

# Learn More

[Documentation](https://sli.dev) · [GitHub](https://github.com/slidevjs/slidev) · [Showcases](https://sli.dev/resources/showcases)

<PoweredBySlidev mt-10 />
