"use strict";
{
    const cfg = HFS.getPluginConfig()
    
    // Parse config strings into arrays
    function parseConfigString(str) {
        if (!str || typeof str !== 'string') return []
        return str
            .split(/[\n,]+/)
            .map(item => item.trim())
            .filter(item => item.length > 0)
    }
    
    // Get hide rules for files and folders
    const hiddenFiles = parseConfigString(cfg.hideFiles)
    const hiddenExactFiles = parseConfigString(cfg.hideExactFiles)
    const hiddenFolders = parseConfigString(cfg.hideFolders)
    
    // Create matcher functions from patterns (支持通配符)
    function createMatchers(patterns) {
        return patterns.map(pattern => {
            try {
                const regexStr = pattern
                    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
                    .replace(/\*/g, '.*')
                    .replace(/\?/g, '.')
                
                return {
                    pattern: pattern,
                    regex: new RegExp('^' + regexStr + '$', 'i')
                }
            } catch (e) {
                return null
            }
        }).filter(matcher => matcher !== null)
    }
    
    // 精确匹配：使用 toLowerCase() 确保大小写通用
    function checkExactMatch(filename, patterns) {
        if (!patterns || patterns.length === 0) return false
        
        const lowerFilename = filename.toLowerCase()
        return patterns.some(pattern => {
            const lowerPattern = pattern.toLowerCase()
            return lowerFilename === lowerPattern
        })
    }
    
    const fileMatchers = createMatchers(hiddenFiles)
    const folderMatchers = createMatchers(hiddenFolders)
    
    // Check if name matches any wildcard pattern
    function matchesWildcard(name, matchers) {
        return matchers.some(matcher => matcher.regex.test(name))
    }
    
    // Listen for new list entries
    HFS.onEvent('newListEntries', ({ entries }) => {
        // Iterate backwards to avoid index issues
        for (let i = entries.length - 1; i >= 0; i--) {
            const entry = entries[i]
            
            if (entry.isFolder) {
                if (matchesWildcard(entry.n, folderMatchers)) {
                    entries.splice(i, 1)
                }
            } else {
                // 检查通配符匹配 或 精确文件名匹配（大小写通用）
                if (matchesWildcard(entry.n, fileMatchers) || checkExactMatch(entry.n, hiddenExactFiles)) {
                    entries.splice(i, 1)
                }
            }
        }
    })
}