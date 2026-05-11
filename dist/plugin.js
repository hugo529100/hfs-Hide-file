exports.version = 1.0
exports.description = "Hide specified files and folders from the file list. Supports wildcard patterns for flexible matching."
exports.apiRequired = 8.9
exports.repo = "Hug3O/Hide-files"
exports.frontend_js = 'main.js'

exports.config = {
    hideFiles: {
        frontend: true,
        type: 'string',
        defaultValue: 'readme.*, .*, *.tmp, *.bak, *.ion, *.lnk, *.log, *.bat, *.json, tmp_*, *.ini',
        multiline: true,
        label: "Files to hide (supports wildcards, separate with commas or new lines, e.g.: *.txt, private*, .gitignore)",
        sm: 12
    },
    hideExactFiles: {
        frontend: true,
        type: 'string',
        defaultValue: 'conversion_log.txt, conversionlog.txt, lists.txt, lists2.txt',
        multiline: true,
        label: "Exact file names to hide (full name match, separate with commas or new lines)",
        sm: 12
    },
    hideFolders: {
        frontend: true,
        type: 'string',
        defaultValue: 'node_modules, .*, private, cache, temp',
        multiline: true,
        label: "Folders to hide (supports wildcards, separate with commas or new lines, e.g.: node_modules, .git, private*)",
        sm: 12
    }
}