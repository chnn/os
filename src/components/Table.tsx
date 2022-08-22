import classNames from "./Table.module.css";

type Children = JSX.Element | JSX.Element[] | string | number;

const Header = ({ children }: { children?: Children }) => {
  return <thead className="">{children}</thead>;
};

const Body = ({ children }: { children?: Children }) => {
  return <tbody className="">{children}</tbody>;
};

const Footer = ({ children }: { children?: Children }) => {
  return <tfoot className="">{children}</tfoot>;
};

const Row = ({ children }: { children?: Children }) => {
  return <tr className="even:bg-slate-50">{children}</tr>;
};

const Th = ({
  children,
  className = "",
}: {
  children?: Children;
  className?: string;
}) => {
  return (
    <th
      className={`border-b border-zinc-300 font-medium py-1 px-3  text-left ${className}`}
    >
      {children}
    </th>
  );
};

const Td = ({
  children,
  className = "",
}: {
  children?: Children;
  className?: string;
}) => {
  return (
    <td
      className={`border-b border-zinc-100 py-1 px-3 text-left align-top ${className}`}
    >
      {children}
    </td>
  );
};

export const Table = ({ children }: { children?: Children }) => {
  return (
    <div className="w-full overflow-x-scroll sm:p-5">
      <table className="w-full table-fixed min-w-[600px]">{children}</table>
    </div>
  );
};

Table.Header = Header;
Table.Body = Body;
Table.Footer = Footer;
Table.Row = Row;
Table.Th = Th;
Table.Td = Td;
