import { h, signal } from "fuse";
import { defineApp, styled } from "../pmod";
import { Button } from "../pmod/primitives/components/button";
import { VStack } from "../pmod/primitives/layout/vstack";

// TODO; Create more primitives.
const Title = styled('h1', { color: 'var(--text-primary)', margin: '0' });

const Input = styled('input', {
    padding: 'var(--space-sm)', borderRadius: 'var(--radius-base)',
    border: '1px solid rgba(255,255,255,0.1)', background: 'var(--bg-soft)',
    color: 'var(--text-primary)', fontSize: '15px', outline: 'none'
});

const NoteItem = styled('div', {
    display: 'flex', gap: 'var(--space-sm)', alignItems: 'center',
    padding: 'var(--space-sm)', background: 'var(--bg-soft)',
    borderRadius: 'var(--radius-base)', border: '1px solid rgba(255,255,255,0.06)'
});

const NoteText = styled('span', { flex: '1', color: 'var(--text-primary)' });

defineApp({
    name: "Notes",
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
                <Title>Quick Notes</Title>
                
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
                            <NoteText>{note}</NoteText>
                            <Button variant="ghost" onClick={() => deleteNote(i)} style="padding: var(--space-xs)">x</Button>
                        </NoteItem>
                    ))}
                </VStack>
            </VStack>
        );
    },
});