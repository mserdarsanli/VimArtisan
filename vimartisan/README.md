Vim Colorscheme Generator

# TMUX

TODO Pop a warning (on color generation when running inside tmux and terminal is not set up correctly)
To launch tmux that behaves like a regular terminal, use follow the instructions from:
http://unix.stackexchange.com/a/1098

# ISSUES

When TERM is "xterm" (default for gnome-terminal), vim prints 0xbd byte, which is not part of an escape sequence. Parsing it as utf-8 character fails, as the next characters are not continuation characters (next one is <ESC> all the time).

On tmux, TERM is set to screen-256color. In this case that character does not appear. OVerriding TERM as "xterm", causes the 0xbd byte to be printed again.

It is currently unknown, what that character is for.

= Comment #2:

Found following comment in vim src/term.c:

    /*
     * Check how the terminal treats ambiguous character width (UAX #11).
     * First, we move the cursor to (1, 0) and print a test ambiguous character
     * \u25bd (WHITE DOWN-POINTING TRIANGLE) and query current cursor position.
     * If the terminal treats \u25bd as single width, the position is (1, 1),
     * or if it is treated as double width, that will be (1, 2).
     * This function has the side effect that changes cursor position, so
     * it must be called immediately after entering termcap mode.
     */

And from inside the function:

    term_windgoto(1, 0);
    buf[mb_char2bytes(0x25bd, buf)] = 0;
    out_str(buf);
    out_str(T_U7);
    u7_status = U7_SENT;
    out_flush();
    term_windgoto(1, 0);
    out_str((char_u *)"  ");
    term_windgoto(0, 0);
    /* check for the characters now, otherwise they might be eaten by
     * get_keystroke() */
    out_flush();
    (void)vpeekc_nomap();

TODO Write an echo command to reproduce the same, if possible.

# VIM

# Default Colorscheme

When launched, vim loads colorscheme `default.vim` (data is also hardcoded so
it succeeds even if `runtime/colors/default.vim` does not exist).

Hardcoded data can be found at `src/syntax.c` as defined by

    static char *(highlight_init_both[]) =
    ...

That includes syntax rules such as `NonText`, `ErrorMsg`, `Search`, `LineNr` etc.
These are top level syntax rules, not related to syntax highlighting for
programming languages.

# Syntax On

When syntax is turned on with `:syntax on` command, which is generally present
on `.vimrc` files, `runtime/syntax/syntax.vim` is loaded. That makes rules like
`Statement`, `String`, `Number`, `Constant`, `Preproc`, etc. Those can be thaught
as general programming concepts, not tied particularly to a language.

# Filetype

With the command `:setfiletype cpp` or by loading a file with `.cpp` extension,
`runtime/syntax/cpp.vim` file is loaded. This is similar for other programming
languages.

That `syntax file`, has regex like rules to parse the language into syntax tokens.
Fore example c syntax file declares a rule named `cString`, but instead of
giving color values, it is set to be a link to `String` rule. This way, when user
changes color of string, all rules mapping to `String`, such as `cString` or `javaString`
will have the same colors.

Colorschemes generally do not override specific styles like `javaString`, because
it is assumed that user wants to see `strings` in same color, regardless of the
programming language. Though it is possible to make javaString and cString behave differently.


# Syntax Groups TODO

## SyntaxGroups order to be fixed

### 1- Hardcoded highlight stuff

    vim -u NONE
    :hi

shows basic UI stuff, `LineNr`, `StatusLine` etc.
These are `highlight_init_both` as referenced in vim src.
also related to 'runtime/colors/default.vim'

### 2- Syntax base (colorscheme)

    vim -u NONE
    :syntax on
    :hi

Adds syntax hl related stuff, `Comment`, `Constant`, `String` etc.
'runtime/syntax/syntax.vim' is used for this
Equivalent to `:colorscheme default`
Using other colorschemes produce similar results.

### 3- File type

    vim -u NONE
    :syntax on
    :setfiletype cpp
    :hi

File type dependent stuff, mostly for parsing rules, but can be
individually overridden. `cString`, `cppConstant`, `cppBoolean` etc.


## Solution

Vim class should keep 3 different sets of values
Hardcoded stuff, colorscheme stuff and language stuff
Whenever a new colorscheme is loaded or a new language is selected,
only respective array should be changed.

Syntax group lookups should take all into account
