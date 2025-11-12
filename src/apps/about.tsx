import { h } from "fuse";
import { defineApp, styled, VStack, Tabs, Icon } from "../pmod";

const Header = styled('div', {
    display: 'flex',
    gap: 'var(--space-lg)',
    alignItems: 'center',
    padding: 'var(--space-xl) var(--space-lg)',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.02), transparent)'
});

const Avatar = styled('div', {
    width: '110px',
    height: '110px',
    borderRadius: '16px',
    overflow: 'hidden',
    flexShrink: '0',
    border: '2px solid rgba(255,255,255,0.08)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
});

const HeaderText = styled('div', {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: '1'
});

const Name = styled('h1', {
    fontSize: '22px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    margin: '0',
    letterSpacing: '-0.02em'
});

const Role = styled('p', {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    margin: '0',
    fontWeight: '500'
});

const Location = styled('p', {
    fontSize: '12px',
    color: 'var(--text-muted)',
    margin: '0',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
});

const Section = styled('div', {
    padding: 'var(--space-lg)',
    paddingTop: 'var(--space-md)',
    paddingBottom: 'var(--space-lg)'
});

const SectionTitle = styled('h2', {
    fontSize: '11px',
    fontWeight: '700',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    margin: '0 0 var(--space-md) 0'
});

const Bio = styled('p', {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    lineHeight: '1.7',
    margin: '0'
});

const SkillGrid = styled('div', {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 'var(--space-sm)'
});

const Skill = styled('div', {
    padding: 'var(--space-sm) var(--space-md)',
    background: 'var(--bg-soft)',
    borderRadius: 'var(--radius-md)',
    fontSize: '12px',
    color: 'var(--text-secondary)',
    border: '1px solid rgba(255,255,255,0.06)',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    ':hover': 'background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); transform: translateY(-1px);'
});

const Experience = styled('div', {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    padding: 'var(--space-md)',
    borderRadius: 'var(--radius-md)',
    transition: 'all 0.2s ease',
    border: '1px solid transparent',
    ':hover': 'background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); transform: translateY(-1px);'
});

const ExpTitle = styled('div', {
    fontSize: '15px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    letterSpacing: '-0.01em'
});

const ExpMeta = styled('div', {
    fontSize: '13px',
    color: 'var(--text-muted)',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
});

const Divider = styled('div', {
    height: '1px',
    background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)',
    margin: 'var(--space-md) 0',
    opacity: '0.8'
});

const ExpMetaDot = styled('span', {
    width: '4px',
    height: '4px',
    background: 'var(--text-muted)',
    opacity: '0.5',
    borderRadius: '50%'
});


defineApp({
    name: "About",
    icon: "User",
    width: 580,
    height: 700,
    content() {
        return (
            <div style="display: flex; flex-direction: column; height: 100%; overflow: hidden;">
                <Header>
                    <Avatar>
                        <img
                            src="/public/me.jpg"
                            alt="Preston Arnold"
                            style="width: 100%; height: 100%; object-fit: cover;"
                            loading="eager"
                        />
                    </Avatar>
                    <HeaderText>
                        <Name>Preston Arnold</Name>
                        <Role>Founder & Software Engineer</Role>
                        <Location>
                            <Icon name="MapPin" size={14} color="var(--text-muted)" />
                            Northampton, UK
                        </Location>
                    </HeaderText>
                </Header>

                <Tabs tabs={[
                    {
                        label: "About",
                        content: () => (
                            <Section>
                                <Bio>
                                    I'm a self-taught developer and entrepreneur, home educated since 11, co-founded and managed AstralNodes whilst still in primary school (age 10).
                                </Bio>

                                <Bio style="margin-top: var(--space-md)">
                                    Now I'm building robotics projects and online platforms/websites for companies, focusing on practical, scalable solutions.
                                </Bio>

                                <Bio style="margin-top: var(--space-md); margin-bottom: var(--space-lg);">
                                    I'm open to collaboration, freelance work, or investment opportunities.
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
                                    <Skill>TypeScript / Node.js</Skill>
                                    <Skill>Rust</Skill>
                                    <Skill>React / Frontend Development</Skill>
                                    <Skill>Linux / Shell Scripting</Skill>
                                    <Skill>Docker</Skill>
                                    <Skill>Embedded Systems</Skill>
                                    <Skill>Arduino / Microcontrollers</Skill>
                                    <Skill>Autonomous Robotics</Skill>
                                    <Skill>Computer Vision</Skill>
                                    <Skill>Machine Learning</Skill>
                                    <Skill>PostgreSQL</Skill>
                                    <Skill>Redis</Skill>
                                </SkillGrid>
                            </Section>
                        )
                    },
                    {
                        label: "Experience",
                        content: () => (
                            <Section>
                                <VStack gap={10} style="padding-bottom: var(--space-sm);">
                                    <div>
                                        <SectionTitle>Current Work</SectionTitle>
                                        <VStack gap={10}>
                                            <Experience>
                                                <ExpTitle>Co-Founder & Hardware Engineer</ExpTitle>
                                                <ExpMeta>
                                                    <span>GB Dynamics</span>
                                                    <ExpMetaDot />
                                                    <span>Sep 2025 - Present</span>
                                                </ExpMeta>
                                            </Experience>
                                            <Experience>
                                                <ExpTitle>Founder & Software Engineer</ExpTitle>
                                                <ExpMeta>
                                                    <span>Arnold Development</span>
                                                    <ExpMetaDot />
                                                    <span>Jul 2025 - Present</span>
                                                </ExpMeta>
                                            </Experience>
                                        </VStack>
                                    </div>

                                    <Divider />

                                    <div>
                                        <SectionTitle>Previous Experience</SectionTitle>
                                        <VStack gap={10}>
                                            <Experience>
                                                <ExpTitle>Back-end Developer</ExpTitle>
                                                <ExpMeta>
                                                    <span>RYPR</span>
                                                    <ExpMetaDot />
                                                    <span>Nov 2023 - Mar 2024</span>
                                                </ExpMeta>
                                            </Experience>
                                            <Experience>
                                                <ExpTitle>Lead Developer</ExpTitle>
                                                <ExpMeta>
                                                    <span>Scale Your Shop</span>
                                                    <ExpMetaDot />
                                                    <span>Sep 2023 - Nov 2023</span>
                                                </ExpMeta>
                                            </Experience>
                                            <Experience>
                                                <ExpTitle>Server Administrator</ExpTitle>
                                                <ExpMeta>
                                                    <span>Skyhawk Hosting</span>
                                                    <ExpMetaDot />
                                                    <span>Jan 2021 - Mar 2021</span>
                                                </ExpMeta>
                                            </Experience>
                                            <Experience>
                                                <ExpTitle>Co-Founder & Lead Developer</ExpTitle>
                                                <ExpMeta>
                                                    <span>AstralNodes</span>
                                                    <ExpMetaDot />
                                                    <span>May 2020 - Dec 2020</span>
                                                </ExpMeta>
                                            </Experience>
                                        </VStack>
                                    </div>
                                </VStack>
                            </Section>
                        )
                    }
                ]} />
            </div>
        );
    },
});