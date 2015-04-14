from docutils import nodes
from docutils.statemachine import ViewList

from sphinx import addnodes
from sphinx.domains import Domain
from sphinx.util.compat import Directive


def html_page_context(app, pagename, templatename, context, doctree):
    rendered_toc = get_rendered_toctree(app.builder, pagename)
    context['full_toc'] = rendered_toc


def get_rendered_toctree(builder, docname, prune=False, collapse=True):
    fulltoc = build_full_toctree(builder, docname, prune=prune,
                                 collapse=collapse)
    rendered_toc = builder.render_partial(fulltoc)['fragment']
    return rendered_toc


def build_full_toctree(builder, docname, prune=False, collapse=True):
    env = builder.env
    doctree = env.get_doctree(env.config.master_doc)
    toctrees = []
    for toctreenode in doctree.traverse(addnodes.toctree):
        toctrees.append(env.resolve_toctree(docname, builder, toctreenode,
                                            collapse=collapse,
                                            titles_only=True,
                                            prune=prune))
    if not toctrees:
        return None
    result = toctrees[0]
    for toctree in toctrees[1:]:
        if toctree:
            result.extend(toctree.children)
    env.resolve_references(result, docname, builder)
    return result


def parse_rst(state, content_offset, doc):
    node = nodes.section()
    # hack around title style bookkeeping
    surrounding_title_styles = state.memo.title_styles
    surrounding_section_level = state.memo.section_level
    state.memo.title_styles = []
    state.memo.section_level = 0
    state.nested_parse(doc, content_offset, node, match_titles=1)
    state.memo.title_styles = surrounding_title_styles
    state.memo.section_level = surrounding_section_level
    return node.children


class EditionDirective(Directive):
    has_content = False
    required_arguments = 1
    optional_arguments = 0
    final_argument_whitespace = True

    def run(self):
        editions = set(x.strip() for x in self.arguments[0].split(','))
        doc = ViewList()

        eds = []
        if 'cloud' in editions:
            eds.append('Sentry Cloud')
        if 'enterprise' in editions:
            eds.append('Sentry Enterprise Edition')
        if 'community' in editions:
            eds.append('Sentry Community Edition')

        doc.append('', '')
        doc.append('**Applies to:** %s' %
                   ', '.join('*%s*' % x for x in eds), '')
        doc.append('', '')
        return parse_rst(self.state, self.content_offset, doc)


class SentryDomain(Domain):
    name = 'sentry'
    label = 'Sentry'
    directives = {
        'edition':  EditionDirective
    }


def setup(app):
    app.add_domain(SentryDomain)
    app.connect('html-page-context', html_page_context)
