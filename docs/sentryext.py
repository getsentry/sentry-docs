from docutils import nodes
from docutils.statemachine import ViewList

from sphinx.domains import Domain
from sphinx.util.compat import Directive


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
