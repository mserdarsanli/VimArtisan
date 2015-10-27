# VIm Syntax Rules

VIM syntax rules can be composed of regions.

Regions can be specified as a regex itself,
or a set of `"start"`, `"skip"` and `"end"` regexes.

To see those rules, type

    :syntax

Set of rules for a language can be written to a file
with following commands.

    :set filetype=cpp
    :redir > /tmp/out
    :silent syntax
    :redir END

Each of these has associated colors, which can be seen with

    :hi

# Color Overrides

A color rule can be a link to another syntax rule.
Otherwise it has to its colors like term= ctermfg= ...

Syntax rules like IncSearch are special?, their values are merged into the
original syntax rule. If IncSearch has an override, that value is used,
otherwise original value is used.

IncSearch can specify `term=bold,reverse` which would override term value of
the original rule. Thus if the original rule is reversed, it will stay as
reversed, which might not be what was wanted.

If the term has bold value in the original rule, and IncSearch wants to make
it non-bold, it is probably impossible. But having term=reverse in IncSearch
makes the resulting cell to have a value equal to term=bold,reverse in this
case.

# Extracted Syntax Rules

To extract syntax rules for languages, Vim is executed repetedly to do

    :setfiletype cpp
    :hi

It's output are then processed to get the syntax groups for the language.

# Parsing Syntax Highlight

After loading a file and selecting a language, file is highlighted.
To get which characters in the screeen map to which syntax group
declarations, each syntax group will be configured to print a unique
color. After that, Vim output is parsed to map characters to syntax
groups.

These syntax rules are unique to the language and can map to different
colors via different colorschemes. But the language syntax will be
extracted in the same way as the rules are global, and people generally
don't modify those.

That allows a snippet to be parsed only once to get mappings from characters
to language constructs, and later be colorschemed (via javascript).
