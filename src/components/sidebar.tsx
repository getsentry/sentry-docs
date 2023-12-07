import Link from "next/link";

export function Sidebar() {
  return (
    <ul className="list-unstyled" data-sidebar-tree>
      <li className="mb-3" data-sidebar-branch>
        <Link
          href="/contributing"
          className="sidebar-title d-flex align-items-center"
          data-sidebar-link
        >
          <h6>Contributing to Docs</h6>
        </Link>
      </li>
    </ul>
  );
}
