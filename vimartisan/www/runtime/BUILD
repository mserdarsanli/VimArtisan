package(
    default_visibility = [
        "//vimartisan/www:__pkg__",
    ],
)

load("/vimartisan_snippets/snippets", "SNIPPETS")


# There should be no double-quotes in this file contents
# Otherwise we'd need to worry about shell escaping
LANG_CODE_TO_NAME = ''.join(["    '" + lang[0] + "': '" + lang[1] + "',\n" for lang in SNIPPETS])
LANGNAMES_FILE_CONTENTS = """
// This file is generated from defined snippets
class LangNames {
  private static Langs: { [key:string]:string } = {
""" + LANG_CODE_TO_NAME + """
  };

  // List of supported language codes,
  // sorted by language name
  public static GetSnippetLangs(): Array<string> {
    return Object.keys(LangNames.Langs).sort(function (a, b) {
      return LangNames.Langs[a].localeCompare(LangNames.Langs[b]);
    });
  }

  public static GetLangName(code: string): string {
    return LangNames.Langs[code];
  }
}
"""

genrule(
    name = "gen_languages_file",
    outs = [
        "LangNames.gen.ts",
    ],
    cmd = """echo -n """ + "\"" + LANGNAMES_FILE_CONTENTS + "\" > $(@)",
)

genrule(
    name = "gen_all_files",
    outs = [
        "base.eval.js",
        "colorschemes.eval.js",
    ] + [
        ls[0] + ".eval.js" for ls in SNIPPETS
    ],
    tools = [
        "//vimartisan/src:GenData",
    ],
    cmd = "export TERM=screen-256color && "
        + "$(location //vimartisan/src:GenData)"
        + "  --out_builtin_colorschemes $(location colorschemes.eval.js) "
        + "  --out_base_syntax_groups $(location base.eval.js) "
        + " -- "
        + ''.join([" out:" + ls[0] + " $(location " + ls[0] + ".eval.js) " +
                ''.join([
                    # TODO snippets are not being loaded from runfiles
                    " snippet:" + ls[0] + " \"" + f[1] + "\" \"/VimArtisan/vimartisan_snippets/" + f[2] + "\" "
                    for f in ls[2]
                ])
            for ls in SNIPPETS
        ]),
    local = 1, # For openpty
)
