import { h } from "fuse";
import { defineApp, styled, VStack, Tabs } from "../pmod";

const Header = styled('div', {
    display: 'flex', gap: 'var(--space-lg)', alignItems: 'center',
    padding: 'var(--space-lg)', borderBottom: '1px solid rgba(255,255,255,0.06)'
});

const Avatar = styled('div', {
    width: '80px', height: '80px', borderRadius: '12px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '32px', fontWeight: '600', flexShrink: '0'
});

const HeaderText = styled('div', {
    display: 'flex', flexDirection: 'column', gap: '4px', flex: '1'
});

const Name = styled('h1', {
    fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)', margin: '0'
});

const Role = styled('p', {
    fontSize: '13px', color: 'var(--text-muted)', margin: '0'
});

const Location = styled('p', {
    fontSize: '12px', color: 'var(--text-muted)', margin: '0'
});

const Section = styled('div', {
    padding: 'var(--space-lg)'
});

const SectionTitle = styled('h2', {
    fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)',
    textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 var(--space-sm) 0'
});

const Bio = styled('p', {
    fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: '0'
});

const SkillGrid = styled('div', {
    display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-sm)'
});

const Skill = styled('div', {
    padding: 'var(--space-xs) var(--space-sm)', background: 'var(--bg-soft)',
    borderRadius: 'var(--radius-base)', fontSize: '12px', color: 'var(--text-secondary)',
    border: '1px solid rgba(255,255,255,0.04)'
});

const Experience = styled('div', {
    display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)'
});

const ExpTitle = styled('div', {
    fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)'
});

const ExpMeta = styled('div', {
    fontSize: '11px', color: 'var(--text-muted)'
});

defineApp({
    name: "About",
    icon: "👤",
    width: 520,
    height: 600,
    content() {
        return (
            <div style="display: flex; flex-direction: column; height: 100%">
                <Header>
                    <Avatar>PA</Avatar>
                    <HeaderText>
                        <Name>Preston Arnold</Name>
                        <Role>Founder & Software Engineer</Role>
                        <Location>📍 Northampton, UK</Location>
                    </HeaderText>
                </Header>

                <Tabs tabs={[
                    {
                        label: "About",
                        content: () => (
                            <Section>
                                <Bio>
                                    Technical founder and full-stack engineer with hands-on experience with delivering modern web products. I enjoy building efficient, scalable solutions that help startups move faster. Currently developing autonomous drone systems at GB Dynamics and
                                    internal developer tools at Arnold Development.
                                </Bio>
                                <Bio style="margin-top: var(--space-md)">
                                    Passionate about creating elegant, efficient solutions and helping startups
                                    scale their products. Strong focus on system architecture, backend development,
                                    and building tools that improve developer experience.
                                </Bio>
                            </Section>
                        )
                    },
                    {
                        label: "Skills",
                        content: () => (
                            <Section>
                                <SectionTitle>Technical Skills</SectionTitle>
                                <SkillGrid>
                                    <Skill>TypeScript</Skill>
                                    <Skill>Rust</Skill>
                                    <Skill>Node.js</Skill>
                                    <Skill>React</Skill>
                                    <Skill>AWS</Skill>
                                    <Skill>Docker</Skill>
                                    <Skill>PostgreSQL</Skill>
                                    <Skill>Redis</Skill>
                                    <Skill>Nginx</Skill>
                                    <Skill>Linux</Skill>
                                    <Skill>Puppeteer</Skill>
                                    <Skill>MySQL</Skill>
                                </SkillGrid>
                            </Section>
                        )
                    },
                    {
                        label: "Experience",
                        content: () => (
                            <div>
                                <Section>
                                    <VStack gap={16}>
                                        <div>
                                            <SectionTitle>Current Work</SectionTitle>
                                            <VStack gap={12}>
                                                <Experience>
                                                    <ExpTitle>Co-Founder & Hardware Engineer</ExpTitle>
                                                    <ExpMeta>GB Dynamics | Sep 2025 - Present</ExpMeta>
                                                </Experience>
                                                <Experience>
                                                    <ExpTitle>Founder & Software Engineer</ExpTitle>
                                                    <ExpMeta>Arnold Development | Jul 2025 - Present</ExpMeta>
                                                </Experience>
                                            </VStack>
                                        </div>

                                        <div>
                                            <SectionTitle>Previous Experience</SectionTitle>
                                            <VStack gap={10}>
                                                <Experience>
                                                    <ExpTitle>Back-end Developer</ExpTitle>
                                                    <ExpMeta>RYPR | Nov 2023 - Mar 2024</ExpMeta>
                                                </Experience>
                                                <Experience>
                                                    <ExpTitle>Lead Developer</ExpTitle>
                                                    <ExpMeta>Scale Your Shop | Sep 2023 - Nov 2023</ExpMeta>
                                                </Experience>
                                                <Experience>
                                                    <ExpTitle>Server Administrator</ExpTitle>
                                                    <ExpMeta>Skyhawk Hosting | Jan 2021 - Mar 2021</ExpMeta>
                                                </Experience>
                                                <Experience>
                                                    <ExpTitle>Co-Founder & Lead Developer</ExpTitle>
                                                    <ExpMeta>AstralNodes | May 2020 — Dec 2020</ExpMeta>
                                                </Experience>
                                            </VStack>
                                        </div>
                                    </VStack>
                                </Section>
                            </div>
                        )
                    }
                ]} />
            </div>
        );
    },
});
