import { h, signal } from "fuse";
import { defineApp, styled, VStack, Button, Input, Heading, Text } from "../pmod";

const NoteItem = styled('div', {
    display: 'flex', gap: 'var(--space-sm)', alignItems: 'center',
    padding: 'var(--space-sm)', background: 'var(--bg-soft)',
    borderRadius: 'var(--radius-base)', border: '1px solid rgba(255,255,255,0.06)'
});

defineApp({
    name: "Notes",
    icon: "📝",
    width: 400,
    height: 500,
    content() {
        const notes = signal<string[]>([]);
        const input = signal("");

        const addNote = () => {
            if (input.get().trim()) {
                notes.set([...notes.get(), input.get()]);
                input.set("");
            }
        };

        const deleteNote = (index: number) => {
            notes.set(notes.get().filter((_, i) => i !== index));
        };

        return (
            <VStack gap={20} style="padding: var(--space-lg)">
                <Heading>Quick Notes</Heading>
                
                <VStack gap={12}>
                    <Input
                        value={input}
                        onInput={(e: Event) => input.set((e.target as HTMLInputElement).value)}
                        onKeyPress={(e: KeyboardEvent) => e.key === 'Enter' && addNote()}
                        placeholder="Write a note..."
                    />
                    <Button onClick={addNote}>Add Note</Button>
                </VStack>

                <VStack gap={8}>
                    {() => notes.get().map((note, i) => (
                        <NoteItem>
                            <Text style="flex: 1">{note}</Text>
                            <Button variant="ghost" onClick={() => deleteNote(i)} style="padding: var(--space-xs)">x</Button>
                        </NoteItem>
                    ))}
                </VStack>
            </VStack>
        );
    },
});