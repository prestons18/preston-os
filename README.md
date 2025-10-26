# PrestonOS
My OS-style portfolio, built on [Fuse](https://github.com/prestons18/fuse), which is my framework!

## Features

### PMOD
PMOD is a light, declarative framework which uses Fuse to let you define apps and UI components easily.

Here's an example:
```tsx
import { h, signal } from "fuse";
import { defineApp } from "../pmod";
import { Button } from "../pmod/primitives/button";
import { VStack } from "../pmod/primitives/vstack";

defineApp({
    name: "Simple",
    content() {
        const inputValue = signal("");

        return (
            <VStack gap={8}>
                <h1>Hello, World!</h1>
                <input 
                    value={inputValue} 
                    onInput={(e: Event) => inputValue.set((e.target as HTMLInputElement).value)} 
                />
                <Button 
                    onClick={() => {
                        console.log(inputValue.get());
                    }}
                >
                    Save
                </Button>
            </VStack>
        );
    },
});
```
It's purpose is so I can build modular and reactive apps for this portfolio without repeating myself and boilerplate.

### Window Manager