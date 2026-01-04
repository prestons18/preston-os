import { h } from "@prestonarnold/fuse";
import { defineApp, VStack, Tabs, Icon } from "../../pmod";
import {
  Header,
  Avatar,
  HeaderText,
  Name,
  Role,
  Location,
  Section,
  SectionTitle,
  Bio,
  SkillGrid,
  Skill,
  Experience,
  ExpTitle,
  ExpMeta,
  Divider,
  ExpMetaDot,
} from "./about.styles";

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
              src="/images/me-110.webp"
              srcSet="/images/me-110.webp 1x, /images/me-220.webp 2x"
              alt="Preston Arnold"
              style="width: 100%; height: 100%; object-fit: cover;"
              loading="eager"
              fetchpriority="high"
              decoding="async"
            />
          </Avatar>
          <HeaderText>
            <Name>Preston Arnold</Name>
            <Role>Founder & Technical Lead</Role>
            <Location>
              <Icon name="MapPin" size={14} color="var(--text-muted)" />
              Greater Northampton Area, UK
            </Location>
          </HeaderText>
        </Header>

        <Tabs
          tabs={[
            {
              label: "About",
              content: () => (
                <Section>
                  <Bio>
                    I'm a self-taught developer and entrepreneur, home educated
                    since 11, co-founded and managed AstralNodes whilst still in
                    primary school (age 10).
                  </Bio>

                  <Bio style="margin-top: var(--space-md)">
                    Now I'm building robotics projects and online
                    platforms/websites for companies, focusing on practical,
                    scalable solutions.
                  </Bio>

                  <Bio style="margin-top: var(--space-md); margin-bottom: var(--space-lg);">
                    I'm open to collaboration, freelance work, or investment
                    opportunities.
                  </Bio>
                </Section>
              ),
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
                    <Skill>Computer Vision</Skill>
                    <Skill>AI / Machine Learning</Skill>
                    <Skill>GraphQL</Skill>
                    <Skill>PostgreSQL</Skill>
                    <Skill>Redis</Skill>
                  </SkillGrid>
                </Section>
              ),
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
                          <ExpTitle>Founder & Technical Lead</ExpTitle>
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
              ),
            },
          ]}
        />
      </div>
    );
  },
});
