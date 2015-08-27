#!/usr/bin/env python
import os
import zlib
import json
import click
from datetime import datetime


BASE = os.path.abspath(os.path.join(os.path.dirname(__file__), os.path.pardir))
DOC_BASE = os.path.join(BASE, 'docs')
API_DOCS = os.path.join(DOC_BASE, 'api')
API_CACHE = os.path.join(DOC_BASE, '_apicache')


def color_for_string(s):
    colors = ('red', 'green', 'yellow', 'blue', 'cyan', 'magenta')
    return colors[zlib.crc32(s) % len(colors)]


def report(category, message, fg=None):
    if fg is None:
        fg = color_for_string(category)
    click.echo('[%s] %s: %s' % (
        str(datetime.utcnow()).split('.')[0],
        click.style(category, fg=fg),
        message
    ))


def iter_section_entries(entries):
    entries = entries.items()
    entries.sort(key=lambda x: x[1].lower())
    for ident, _ in entries:
        with open(os.path.join(API_CACHE, 'endpoints', ident + '.json')) as f:
            yield json.load(f)


def iter_sections():
    with open(os.path.join(API_CACHE, 'sections.json')) as f:
        sections = json.load(f)['sections'].items()
        sections.sort(key=lambda x: x[1]['title'].lower())
        for ident, data in sections:
            yield {
                'id': ident,
                'title': data['title'],
                'entries': list(iter_section_entries(data['entries'])),
            }


def write_api_endpoint(endpoint):
    report('endpoint', 'Generating docs for "%s"' % endpoint['endpoint_name'])
    fn = os.path.join(API_DOCS, endpoint['section'].encode('ascii'),
                      endpoint['endpoint_name'].encode('ascii') + '.rst')

    lines = [
        '.. this file is auto generated. do not edit',
        '',
        endpoint['title'],
        '=' * len(endpoint['title']),
        '',
        '.. sentry:api-endpoint:: %s' % endpoint['endpoint_name'],
        '',
    ]

    for line in endpoint['text']:
        lines.append('    ' + line)

    lines.append('')
    lines.append('    :http-method: %s' % endpoint['method'])
    lines.append('    :http-path: %s' % endpoint['path'])

    if endpoint['scenarios']:
        lines.append('')
        lines.append('Example')
        lines.append('-------')
        lines.append('')
        for scenario in endpoint['scenarios']:
            lines.append('')
            lines.append('.. sentry:api-scenario:: %s' % scenario)

    with open(fn, 'w') as f:
        for line in lines:
            f.write(line.encode('utf-8') + '\n')


def write_section_index(section):
    report('section', 'Generating section index for "%s"' % section['id'])
    fn = os.path.join(API_DOCS, section['id'].encode('ascii'), 'index.rst')
    lines = [
        '.. this file is auto generated. do not edit',
        '',
        section['title'],
        '=' * len(section['title']),
        '',
        '.. toctree::',
        '   :maxdepth: 1',
        '',
    ]
    for entry in section['entries']:
        lines.append('   ' + entry['endpoint_name'])

    try:
        os.makedirs(os.path.dirname(fn))
    except OSError:
        pass
    with open(fn, 'w') as f:
        for line in lines:
            f.write(line.encode('utf-8') + '\n')

    for entry in section['entries']:
        write_api_endpoint(entry)


def write_index_include(sections):
    report('index', 'Generating API index')
    fn = os.path.join(API_DOCS, 'sections.rst.inc')
    lines = [
        '.. this file is auto generated. do not edit',
        '',
        '.. toctree::',
        '   :maxdepth: 2',
        '',
    ]
    for section in sections:
        lines.append('   %s/index' % section)

    with open(fn, 'w') as f:
        for line in lines:
            f.write(line.encode('utf-8') + '\n')


@click.command()
def cli():
    """Generate the API documentation."""
    sections = []

    for section in iter_sections():
        if section['entries']:
            write_section_index(section)
            sections.append(section['id'])

    write_index_include(sections)


if __name__ == '__main__':
    cli()
