import Link from "next/link";

export function Sidebar({ docs }) {
  return (
    <ul className="list-unstyled" data-sidebar-tree>
      <li className="mb-3" data-sidebar-branch>
        <ul className="list-unstyled" data-sidebar-tree>
          {docs.map((doc) => (
            <li className="toc-item" key={doc.slug} data-sidebar-branch>
              <Link
                href={"/" + doc.slug}
                data-sidebar-link
                >
                {doc.title}
              </Link>
            </li>
          ))}
        </ul>
      </li>
      {/* <li className="mb-3" data-sidebar-branch>
        <Link
          href="/contributing"
          className="sidebar-title d-flex align-items-center"
          data-sidebar-link
        >
          <h6>Contributing to Docs</h6>
        </Link>
      </li> */}
    </ul>
  );
}
