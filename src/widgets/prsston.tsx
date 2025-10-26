import { h, signal } from "fuse";
import { defineWidget, Widget, WidgetHeader, WidgetTitle, WidgetContent, WidgetItem, WidgetItemTitle, WidgetItemMeta, WidgetAction, Icon } from "../pmod";

interface BlogPost {
  title: string;
  link: string;
  pubDate: string;
  description?: string;
}

defineWidget({
  name: "prsston",
  icon: "Rss",
  defaultWidth: 320,
  defaultHeight: 400,
  refreshInterval: 300000,
  content: ({ x, y }) => {
    const posts = signal<BlogPost[]>([]);
    const loading = signal(false);
    const error = signal<string | null>(null);

    const formatDate = (dateString: string) => {
      try {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      } catch {
        return dateString;
      }
    };

    const openLink = (url: string) => {
      window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
      <Widget style={`left: ${x}px; top: ${y}px; width: 320px; max-height: 400px;`}>
        <WidgetHeader>
          <WidgetTitle>
            <Icon name="Rss" size={16} />
            <span>prsston</span>
            {/* <WidgetBadge>{() => posts.get().length}</WidgetBadge> */}
          </WidgetTitle>
          <WidgetAction title="Refresh">
            <Icon name="RefreshCw" size={14} />
          </WidgetAction>
        </WidgetHeader>

        <WidgetContent>
          {() => {
            if (loading.get()) {
              return (
                <div style="display: flex; align-items: center; justify-content: center; padding: var(--space-lg); color: var(--text-muted);">
                  <Icon name="Loader2" size={20} />
                  <span style="margin-left: 8px;">Loading posts...</span>
                </div>
              );
            }

            if (error.get()) {
              return (
                <div style="display: flex; flex-direction: column; align-items: center; gap: var(--space-sm); padding: var(--space-lg); color: var(--text-muted); text-align: center;">
                  <Icon name="AlertCircle" size={20} />
                  <span style="font-size: 13px;">{error.get()}</span>
                  <button
                    style="background: var(--bg-soft); border: none; padding: 6px 12px; border-radius: var(--radius-base); cursor: pointer; color: var(--text-primary); font-size: 12px;"
                  >
                    Try Again
                  </button>
                </div>
              );
            }

            const postList = posts.get();
            if (postList.length === 0) {
              return (
                <div style="display: flex; align-items: center; justify-content: center; padding: var(--space-lg); color: var(--text-muted); font-size: 13px;">
                  No posts found
                </div>
              );
            }

            return postList.map(post => (
              <WidgetItem
                onClick={() => openLink(post.link)}
                onMouseEnter={(e: MouseEvent) => {
                  (e.currentTarget as HTMLElement).style.background = 'var(--bg-soft)';
                }}
                onMouseLeave={(e: MouseEvent) => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                <WidgetItemTitle>{post.title}</WidgetItemTitle>
                <WidgetItemMeta>{formatDate(post.pubDate)}</WidgetItemMeta>
              </WidgetItem>
            ));
          }}
        </WidgetContent>
      </Widget>
    );
  }
});