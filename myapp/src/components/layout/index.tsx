import { ReactNode } from "react";
import { Menu } from "./menu";
import { Message } from "../common";
import { Alert } from "../common/message";

interface LayoutProps {
  titulo?: string;
  children?: ReactNode;
  mensagens?: Array<Alert>;
}

export const Layout: React.FC<LayoutProps> = ({ titulo, children, mensagens }: LayoutProps) => {
  return (
    <div className="app">
      <section className="main-content columns is-fullheight">
        <Menu />

        <div className="container column is-10">
            <div className="section ">
              <div className="card">
                <div className="card-header">
                  <p className="card-header-title">
                    { titulo }
                  </p>
                </div>
                <div className="card-content">
                  <div className="content">
                    {mensagens &&
                      mensagens.map(msg => <Message key={msg.texto} {...msg} />)
                    }
                    { children }
                  </div>
                </div>
              </div>
            </div>
        </div>
      </section>
    </div>
  );
}