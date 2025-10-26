import { h, signal } from "fuse";
import { defineApp } from "../pmod";
import { Button } from "../pmod/primitives/button";
import { VStack } from "../pmod/primitives/vstack";

defineApp({
    name: "Notes",
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