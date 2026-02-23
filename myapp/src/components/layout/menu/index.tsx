import Link from "next/link";

export const Menu: React.FC = () => {
  return (
    <aside className="column is-2 is-narrow-mobile is-fullheight section is-hidden-mobile">
      <p className="menu-label is-hidden-touch">
        Minhas Vendas
      </p>
      <ul className="menu-list">
        <MenuItem href="/" label="Home"/>
        <MenuItem href="/consultas/produtos" label="Cadastros"/>
        <MenuItem href="/cadastros/clientes" label="Clientes" />
        <MenuItem href="/vendas/nova-venda" label="Venda"/>
        <MenuItem href="/vendas/relatorio-vendas" label="Relatório"/>
        <MenuItem href="/" label="Sair"/>
      </ul>
    </aside>
  );
}

interface MenuItemProps {
  href: string;
  label: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ href, label }: MenuItemProps) => {
  return (
    <li>
      <Link legacyBehavior href={href}>
        <a>
          <span className="icon"></span> {label}
        </a>
      </Link>
    </li>
  );
}