import { ExternalLink } from '#/ui/external-link';
import { InternalLink } from '#/ui/internal-link';

export default function Page() {
  return (
    <div className="prose prose-sm prose-invert max-w-none">
      <h1 className="text-xl font-bold">MoL Documentation</h1>

      <ul>
        <li>
          Here you will find a brief overview of how MoL works as well as
          pricing options.
        </li>
        <li>
          To view the full documentation, go on the official MoL documentation
          site.
        </li>
      </ul>

      <div className="flex gap-2">
        <ExternalLink href="https://info.mol.app/posts/how-to-setup-mol">
          <span className="text-blue-400 hover:text-blue-300">Full Docs</span>
        </ExternalLink>
        <InternalLink href="settings/plans">
          <span className="text-blue-400 hover:text-blue-300">Plans</span>
        </InternalLink>
      </div>
    </div>
  );
}
