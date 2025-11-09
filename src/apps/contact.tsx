import { h } from "fuse";
import { defineApp, styled, VStack, Heading, Text, Icon } from "../pmod";
import type { icons } from "lucide";

const Card = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-sm)',
  background: 'var(--bg-soft)',
  borderRadius: 'var(--radius-base)',
  border: '1px solid rgba(255,255,255,0.06)',
  padding: 'var(--space-sm)',
  marginBottom: 'var(--space-sm)',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  ':hover': 'background: rgba(255,255,255,0.03); transform: translateY(-1px);'
});

const Detail = styled('div', { 
  fontSize: '13px', 
  color: 'var(--text-secondary)', 
  display: 'flex', 
  alignItems: 'center', 
  gap: '6px' 
});

defineApp({
  name: "Contact",
  icon: "Link",
  width: 400,
  height: 600,
  content() {
    const contact = { 
      name: "Preston Arnold", 
      role: "Founder & Software Engineer", 
      email: "me@prestonarnold.uk", 
      phone: "+44 7788 592563" 
    };
    
    const socials: Array<{ name: string; icon: keyof typeof icons; url: string }> = [
      { name: "LinkedIn", icon: "Linkedin", url: "https://linkedin.com/in/prestonarnold9" },
      { name: "Twitter", icon: "Twitter", url: "https://x.com/prestonarnolds" },
      { name: "GitHub", icon: "Github", url: "https://github.com/prestons18" },
      { name: "Instagram", icon: "Instagram", url: "https://www.instagram.com/prestonarnold18" },
    ];
    
    return (
      <VStack gap={12} style="padding: var(--space-md); height: 100%; overflow-y: auto;">
        <Heading>Contact</Heading>
        <div style="margin-top: var(--space-sm)">
          <Card>
            <div>
              <div style="font-size: 15px; font-weight: 600; color: var(--text-primary); margin-bottom: 4px">
                {contact.name}
              </div>
              <Detail><Icon name="Briefcase" size={12} />{contact.role}</Detail>
              <Detail><Icon name="Mail" size={12} />{contact.email}</Detail>
              <Detail><Icon name="Phone" size={12} />{contact.phone}</Detail>
            </div>
          </Card>
        </div>
        <div style="height: 1px; background: linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent); margin: var(--space-sm) 0" />
        <div>
          {socials.map(s => 
            <Card 
              onClick={() => window.open(s.url, '_blank')} 
              style="text-decoration: none; color: var(--text-primary); cursor: pointer;"
            >
              <Icon name={s.icon} size={16} />
              <Text>{s.name}</Text>
            </Card>
          )}
        </div>
      </VStack>
    );
  },
});