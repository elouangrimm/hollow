import { Encode, Decode, Hash, DownloadData, HumanTime } from "./functions.js"
import History from "./history.js"
import WindowDrag from "./windowDrag.js"

const ABILITY_FIELDS = [
    "hasDash",
    "hasWalljump",
    "hasDoubleJump",
    "hasSuperJump",
    "hasBrolly",
    "hasNeedleThrow",
    "hasThreadSphere",
    "hasParry",
    "hasHarpoonDash",
    "hasSilkCharge",
    "hasNeedolin",
    "hasChargeSlash"
]

const history = new History()
const windowDrag = new WindowDrag()

const elements = {
    cover: document.querySelector("#cover"),
    fileButton: document.querySelector("#file-button"),
    fileInput: document.querySelector("#file-input"),
    switchSave: document.querySelector("#switch-save"),
    status: document.querySelector("#status"),
    workspace: document.querySelector("#workspace"),
    editorName: document.querySelector("#editor-name"),
    editor: document.querySelector("#editor"),
    formatJson: document.querySelector("#format-json"),
    reset: document.querySelector("#reset"),
    downloadSwitch: document.querySelector("#download-switch"),
    downloadPc: document.querySelector("#download-pc"),
    historySection: document.querySelector("#history"),
    historyList: document.querySelector("#history-list"),
    stats: document.querySelector("#stats"),
    abilityGrid: document.querySelector("#ability-grid"),
    syncGuided: document.querySelector("#sync-guided"),
    fieldVersion: document.querySelector("#field-version"),
    fieldGeo: document.querySelector("#field-geo"),
    fieldMaxHealth: document.querySelector("#field-max-health"),
    fieldMaxSilk: document.querySelector("#field-max-silk")
}

const state = {
    gameFile: "",
    gameFileOriginal: "",
    gameFileName: "",
    editing: false,
    switchMode: false,
    syncTimer: null
}

const guidedFields = [
    { element: elements.fieldVersion, path: "playerData.version", type: "string" },
    { element: elements.fieldGeo, path: "playerData.geo", type: "number" },
    { element: elements.fieldMaxHealth, path: "playerData.maxHealth", type: "number" },
    { element: elements.fieldMaxSilk, path: "playerData.silkMax", type: "number" }
]

const setStatus = (message, tone = "ok") => {
    elements.status.textContent = message
    elements.status.classList.remove("status-ok", "status-warn", "status-error")
    elements.status.classList.add(`status-${tone}`)
}

const safeParseEditor = () => {
    try {
        return JSON.parse(elements.editor.value)
    } catch (error) {
        return null
    }
}

const getByPath = (source, path) => {
    const parts = path.split(".")
    let current = source
    for (let i = 0; i < parts.length; i += 1) {
        if (current == null || typeof current !== "object" || !(parts[i] in current)) {
            return undefined
        }
        current = current[parts[i]]
    }
    return current
}

const setByPath = (source, path, value) => {
    const parts = path.split(".")
    let current = source
    for (let i = 0; i < parts.length - 1; i += 1) {
        const key = parts[i]
        if (current[key] == null || typeof current[key] !== "object") {
            current[key] = {}
        }
        current = current[key]
    }
    current[parts[parts.length - 1]] = value
}

const refreshGuidedFields = () => {
    const parsed = safeParseEditor()
    if (!parsed) {
        setStatus("JSON is currently invalid. Guided editor is paused.", "error")
        return
    }

    guidedFields.forEach((field) => {
        const value = getByPath(parsed, field.path)
        field.element.value = value == null ? "" : String(value)
    })

    ABILITY_FIELDS.forEach((ability) => {
        const checkbox = document.querySelector(`#ability-${ability}`)
        if (!checkbox) {
            return
        }
        checkbox.checked = Boolean(getByPath(parsed, `playerData.${ability}`))
    })

    renderStats(parsed)

    setStatus("JSON synced.", "ok")
}

const applyGuidedField = (field) => {
    const parsed = safeParseEditor()
    if (!parsed) {
        setStatus("Fix JSON before editing guided values.", "error")
        return
    }

    let nextValue = field.element.value
    if (field.type === "number") {
        if (nextValue === "") {
            setStatus("Numeric values cannot be empty.", "warn")
            return
        }
        const numeric = Number(nextValue)
        if (!Number.isFinite(numeric)) {
            setStatus("Please provide a valid number.", "warn")
            return
        }
        nextValue = numeric
    }

    setByPath(parsed, field.path, nextValue)
    const formatted = JSON.stringify(parsed, null, 2)
    state.gameFile = formatted
    elements.editor.value = formatted
    renderStats(parsed)
    setStatus(`Updated ${field.path}.`, "ok")
}

const applyAbilityField = (abilityName, isEnabled) => {
    const parsed = safeParseEditor()
    if (!parsed) {
        setStatus("Fix JSON before editing abilities.", "error")
        return
    }

    setByPath(parsed, `playerData.${abilityName}`, Boolean(isEnabled))
    const formatted = JSON.stringify(parsed, null, 2)
    state.gameFile = formatted
    elements.editor.value = formatted
    renderStats(parsed)
    setStatus(`Updated playerData.${abilityName}.`, "ok")
}

const formatPlayTime = (value) => {
    const numeric = Number(value)
    if (!Number.isFinite(numeric) || numeric < 0) {
        return "unknown"
    }

    const totalSeconds = Math.floor(numeric)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    const hoursText = hours.toString()
    const minutesText = minutes.toString().padStart(2, "0")
    const secondsText = seconds.toString().padStart(2, "0")
    return `${hoursText}:${minutesText}:${secondsText}`
}

const statBlock = (label, value, iconPath = "", iconPath2 = "") => {
    const icon = iconPath ? `<img src="${iconPath}" alt="" class="stat-icon">` : ""
    const icon2 = iconPath2 ? `<img src="${iconPath2}" alt="" class="stat-icon">` : ""
    return `<div class="stat-card">${icon}${icon2}<div><div class="stat-label">${label}</div><div class="stat-value">${value}</div></div></div>`
}

const renderStats = (parsed) => {
    const playerData = parsed && parsed.playerData ? parsed.playerData : {}
    const geo = playerData.geo ?? 0
    const rosaries = playerData.PreMemoryState && Number.isFinite(playerData.PreMemoryState.Rosaries)
        ? playerData.PreMemoryState.Rosaries
        : 0
    const silk = playerData.silk ?? 0
    const silkMax = playerData.silkMax ?? 0
    const health = playerData.health ?? 0
    const maxHealth = playerData.maxHealth ?? 0
    const playTime = formatPlayTime(playerData.playTime)
    const version = playerData.version || "unknown"

    elements.stats.innerHTML = [
        statBlock("Geo/Rosaries", geo, "assets/geo.png", "assets/rosary.png"),
        statBlock("Health", `${health}/${maxHealth}`),
        statBlock("Silk", `${silk}/${silkMax}`),
        statBlock("Play Time", playTime),
        statBlock("Version", version)
    ].join("")
}

const renderAbilityEditor = () => {
    const abilityLabels = {
        hasDash: "Swift Step (Dash)",
        hasWalljump: "Cling Grip (Wall Jump)",
        hasDoubleJump: "Faydown Cloak (Double Jump)",
        hasSuperJump: "Silk Soar (Super Jump)",
        hasBrolly: "Drifter’s Cloak",
        hasNeedleThrow: "Silkspear",
        hasThreadSphere: "Thread Storm",
        hasParry: "Cross Stitch (Parry)",
        hasHarpoonDash: "Clawline",
        hasSilkCharge: "Sharpdart",
        hasNeedolin: "Needolin",
        hasChargeSlash: "Needle Strike"
    }

    elements.abilityGrid.innerHTML = ""
    ABILITY_FIELDS.forEach((ability) => {
        const row = document.createElement("label")
        row.className = "ability-item"

        const checkbox = document.createElement("input")
        checkbox.type = "checkbox"
        checkbox.id = `ability-${ability}`
        checkbox.addEventListener("change", () => {
            applyAbilityField(ability, checkbox.checked)
        })

        const text = document.createElement("span")
        text.textContent = abilityLabels[ability] || ability

        row.append(checkbox, text)
        elements.abilityGrid.append(row)
    })
}

const openEditor = (jsonString, fileName) => {
    const formatted = JSON.stringify(JSON.parse(jsonString), null, 2)
    state.gameFile = formatted
    state.gameFileOriginal = formatted
    state.gameFileName = fileName
    state.editing = true

    elements.editorName.textContent = fileName
    elements.editor.value = formatted
    elements.workspace.classList.remove("hidden")
    refreshGuidedFields()
}

const renderHistory = () => {
    elements.historyList.innerHTML = ""

    if (history.count() === 0) {
        elements.historySection.classList.add("hidden")
        return
    }

    elements.historySection.classList.remove("hidden")
    history.history.forEach((item) => {
        const li = document.createElement("li")
        li.className = "history-item"

        const name = document.createElement("div")
        name.className = "history-name"
        name.textContent = `HASH ${item.hash}`

        const date = document.createElement("div")
        date.className = "history-date"
        date.textContent = HumanTime(item.date)

        li.append(name, date)

        li.addEventListener("click", () => {
            openEditor(item.jsonString, item.fileName)
            window.scrollTo({ top: 0, behavior: "smooth" })
        })

        li.addEventListener("contextmenu", (event) => {
            event.preventDefault()
            history.removeFromHistory(item.hash)
            history.syncToLocalStorage()
        })

        elements.historyList.append(li)
    })
}

const handleFileChange = (files) => {
    if (!files || files.length === 0) {
        return
    }

    const file = files[0]
    const reader = new FileReader()

    if (state.switchMode) {
        reader.readAsText(file)
    } else {
        reader.readAsArrayBuffer(file)
    }

    reader.addEventListener("load", () => {
        try {
            const raw = reader.result
            const decoded = state.switchMode ? raw : Decode(new Uint8Array(raw))
            const jsonString = JSON.stringify(JSON.parse(decoded), null, 2)
            const hash = Hash(jsonString)

            history.removeFromHistory(hash)
            history.addToHistory(jsonString, file.name, hash)
            history.syncToLocalStorage()

            openEditor(jsonString, file.name)
            setStatus("Save file loaded.", "ok")
        } catch (error) {
            setStatus("Could not read this file. Check mode or file validity.", "error")
            console.warn(error)
        }

        elements.fileInput.value = ""
    })
}

const formatEditorJson = () => {
    const parsed = safeParseEditor()
    if (!parsed) {
        setStatus("Cannot format invalid JSON.", "error")
        return
    }

    const formatted = JSON.stringify(parsed, null, 2)
    state.gameFile = formatted
    elements.editor.value = formatted
    refreshGuidedFields()
}

const resetEditor = () => {
    if (!state.editing) {
        return
    }

    state.gameFile = state.gameFileOriginal
    elements.editor.value = state.gameFileOriginal
    refreshGuidedFields()
    setStatus("Editor reset to original file content.", "ok")
}

const downloadSwitch = async () => {
    const parsed = safeParseEditor()
    if (!parsed) {
        setStatus("Could not parse valid JSON.", "error")
        return
    }

    const fileName = state.gameFileName || "save.dat"
    const saved = await DownloadData(JSON.stringify(parsed), fileName, { saveAs: true })
    if (saved) {
        setStatus(`Downloaded ${fileName}.`, "ok")
    } else {
        setStatus("Save dialog was cancelled.", "warn")
    }
}

const downloadPc = async () => {
    const parsed = safeParseEditor()
    if (!parsed) {
        setStatus("Could not parse valid JSON.", "error")
        return
    }

    const fileName = state.gameFileName || "save.dat"
    const encrypted = Encode(JSON.stringify(parsed))
    const saved = await DownloadData(encrypted, fileName, { saveAs: true })
    if (saved) {
        setStatus(`Downloaded ${fileName}.`, "ok")
    } else {
        setStatus("Save dialog was cancelled.", "warn")
    }
}

const scheduleGuidedSync = () => {
    if (state.syncTimer) {
        window.clearTimeout(state.syncTimer)
    }
    state.syncTimer = window.setTimeout(() => {
        refreshGuidedFields()
    }, 260)
}

const initialize = () => {
    renderAbilityEditor()
    history.onChange = renderHistory
    renderHistory()

    windowDrag.onDrop = (event) => {
        elements.cover.classList.add("hidden")
        handleFileChange(event.dataTransfer.files)
    }
    windowDrag.onDragEnter = () => {
        elements.cover.classList.remove("hidden")
    }
    windowDrag.onDragLeave = () => {
        elements.cover.classList.add("hidden")
    }

    elements.fileButton.addEventListener("click", () => {
        elements.fileInput.click()
    })

    elements.fileInput.addEventListener("change", () => {
        handleFileChange(elements.fileInput.files)
    })

    elements.switchSave.addEventListener("change", () => {
        state.switchMode = elements.switchSave.checked
        if (state.switchMode) {
            setStatus("Switch plain text mode enabled.", "ok")
        } else {
            setStatus("PC encrypted mode enabled.", "ok")
        }
    })

    elements.editor.addEventListener("input", () => {
        state.gameFile = elements.editor.value
        scheduleGuidedSync()
    })

    elements.formatJson.addEventListener("click", formatEditorJson)
    elements.reset.addEventListener("click", resetEditor)
    elements.downloadSwitch.addEventListener("click", downloadSwitch)
    elements.downloadPc.addEventListener("click", downloadPc)
    elements.syncGuided.addEventListener("click", refreshGuidedFields)

    guidedFields.forEach((field) => {
        field.element.addEventListener("change", () => {
            applyGuidedField(field)
        })
    })

    setStatus("Pick a file to begin.", "ok")
}

initialize()




