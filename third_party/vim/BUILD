licenses(["notice"]) # Vim License

package(
    default_visibility = [
        "//visibility:public",
    ],
)

# Builds vim binary

# TODO do not use /tmp
VIM_COMPILE_COMMAND = """
    OUTPUT_FILE="$$(pwd)/$@"                    &&
    TMP_DIR=$$(mktemp -d)                       &&
    cp -R third_party/vim/vim_repo $$TMP_DIR    &&
    cd $$TMP_DIR/vim_repo                       &&
    ./configure                                 &&
    make                                        &&
    cp src/vim "$$OUTPUT_FILE"
"""

# TODO Add version number to the output
genrule(
    name = "vim_binary",
    srcs = glob(
        ["vim_repo/**"],
        # Don't check these files as the parentheses break bazel
        exclude = [
            # Can't write full file names, as bazel also complains here
            "vim_repo/runtime/lang/menu_chinese*"
        ],
    ),
    outs = ["vim"],
    cmd = VIM_COMPILE_COMMAND,
)
