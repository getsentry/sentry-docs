import re
import posixpath
from docutils import nodes

from sphinx import addnodes
from sphinx.domains import Domain
from sphinx.util.osutil import relative_uri
from sphinx.builders.html import StandaloneHTMLBuilder, DirectoryHTMLBuilder


_edition_re = re.compile(r'^(\s*)..\s+sentry:edition::\s*(.*?)$')
_docedition_re = re.compile(r'^..\s+sentry:docedition::\s*(.*?)$')


def make_link_builder(app, base_page):
    def link_builder(edition, to_current=False):
        here = app.builder.get_target_uri(base_page)
        if to_current:
            uri = relative_uri(here, '../' + edition + '/' +
                               here.lstrip('/')) or './'
        else:
            root = app.builder.get_target_uri(app.env.config.master_doc) or './'
            uri = relative_uri(here, root) or ''
            if app.builder.name in ('sentryhtml', 'html'):
                uri = (posixpath.dirname(uri or '.') or '.').rstrip('/') + \
                    '/../' + edition + '/index.html'
            else:
                uri = uri.rstrip('/') + '/../' + edition + '/'
        return uri
    return link_builder


def html_page_context(app, pagename, templatename, context, doctree):
    rendered_toc = get_rendered_toctree(app.builder, pagename)
    context['full_toc'] = rendered_toc

    context['link_to_edition'] = make_link_builder(app, pagename)

    def render_sitemap():
        return get_rendered_toctree(app.builder, 'sitemap', collapse=False)
    context['render_sitemap'] = render_sitemap

    context['sentry_doc_variant'] = app.env.config.sentry_doc_variant


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
                                            includehidden=True,
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


class SentryDomain(Domain):
    name = 'sentry'
    label = 'Sentry'
    directives = {
    }


def preprocess_source(app, docname, source):
    source_lines = source[0].splitlines()

    def _find_block(indent, lineno):
        block_indent = len(indent.expandtabs())
        rv = []
        actual_indent = None

        while lineno < end:
            line = source_lines[lineno]
            if not line.strip():
                rv.append(u'')
            else:
                expanded_line = line.expandtabs()
                indent = len(expanded_line) - len(expanded_line.lstrip())
                if indent > block_indent:
                    if actual_indent is None or indent < actual_indent:
                        actual_indent = indent
                    rv.append(line)
                else:
                    break
            lineno += 1

        if rv:
            rv.append(u'')
            if actual_indent:
                rv = [x[actual_indent:] for x in rv]
        return rv, lineno

    result = []

    lineno = 0
    end = len(source_lines)
    while lineno < end:
        line = source_lines[lineno]
        match = _edition_re.match(line)
        if match is None:
            # Skip sentry:docedition.  We don't want those.
            match = _docedition_re.match(line)
            if match is None:
                result.append(line)
            lineno += 1
            continue
        lineno += 1
        indent, tags = match.groups()
        tags = set(x.strip() for x in tags.split(',') if x.strip())
        should_include = app.env.config.sentry_doc_variant in tags
        block_lines, lineno = _find_block(indent, lineno)
        if should_include:
            result.extend(block_lines)

    source[:] = [u'\n'.join(result)]


def builder_inited(app):
    app.env.sentry_referenced_docs = {}


def remove_irrelevant_trees(app, doctree):
    docname = app.env.temp_data['docname']
    rd = app.env.sentry_referenced_docs
    for toctreenode in doctree.traverse(addnodes.toctree):
        for e in toctreenode['entries']:
            rd.setdefault(str(e[1]), set()).add(docname)


def is_referenced(docname, references):
    if docname == 'index':
        return True
    seen = set([docname])
    to_process = set(references.get(docname) or ())
    while to_process:
        if 'index' in to_process:
            return True
        next = to_process.pop()
        seen.add(next)
        for backlink in references.get(next) or ():
            if backlink in seen:
                continue
            else:
                to_process.add(backlink)
    return False


class SphinxBuilderMixin(object):

    def write_doc(self, docname, doctree):
        if is_referenced(docname, self.app.env.sentry_referenced_docs):
            return super(SphinxBuilderMixin, self).write_doc(docname, doctree)
        else:
            print 'skipping because unreferenced'


class SentryStandaloneHTMLBuilder(SphinxBuilderMixin, StandaloneHTMLBuilder):
    name = 'sentryhtml'


class SentryDirectoryHTMLBuilder(DirectoryHTMLBuilder):
    name = 'sentrydirhtml'


def setup(app):
    from sphinx.highlighting import lexers
    from pygments.lexers.web import PhpLexer
    lexers['php'] = PhpLexer(startinline=True)

    app.add_domain(SentryDomain)
    app.connect('builder-inited', builder_inited)
    app.connect('html-page-context', html_page_context)
    app.connect('source-read', preprocess_source)
    app.connect('doctree-read', remove_irrelevant_trees)
    app.add_builder(SentryStandaloneHTMLBuilder)
    app.add_builder(SentryDirectoryHTMLBuilder)
    app.add_config_value('sentry_doc_variant', None, 'env')
