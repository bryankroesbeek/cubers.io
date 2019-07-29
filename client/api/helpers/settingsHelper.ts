import * as Types from '../types'

export function cleanSettings(settings: Types.UserSettings): Types.CleanUserSettings {
    let megaminxSettings = {
        use_custom_megaminx_colors: settings.use_custom_megaminx_colors.value === "true",
        values: [
            {
                key: "custom_mega_color_1",
                value: settings.custom_mega_color_1.value,
                title: settings.custom_mega_color_1.title
            },
            {
                key: "custom_mega_color_2",
                value: settings.custom_mega_color_2.value,
                title: settings.custom_mega_color_2.title
            },
            {
                key: "custom_mega_color_3",
                value: settings.custom_mega_color_3.value,
                title: settings.custom_mega_color_3.title
            },
            {
                key: "custom_mega_color_4",
                value: settings.custom_mega_color_4.value,
                title: settings.custom_mega_color_4.title
            },
            {
                key: "custom_mega_color_5",
                value: settings.custom_mega_color_5.value,
                title: settings.custom_mega_color_5.title
            },
            {
                key: "custom_mega_color_6",
                value: settings.custom_mega_color_6.value,
                title: settings.custom_mega_color_6.title
            },
            {
                key: "custom_mega_color_7",
                value: settings.custom_mega_color_7.value,
                title: settings.custom_mega_color_7.title
            },
            {
                key: "custom_mega_color_8",
                value: settings.custom_mega_color_8.value,
                title: settings.custom_mega_color_8.title
            },
            {
                key: "custom_mega_color_9",
                value: settings.custom_mega_color_9.value,
                title: settings.custom_mega_color_9.title
            },
            {
                key: "custom_mega_color_10",
                value: settings.custom_mega_color_10.value,
                title: settings.custom_mega_color_10.title
            },
            {
                key: "custom_mega_color_11",
                value: settings.custom_mega_color_11.value,
                title: settings.custom_mega_color_11.title
            },
            {
                key: "custom_mega_color_12",
                value: settings.custom_mega_color_12.value,
                title: settings.custom_mega_color_12.title
            },
        ]
    }

    let cubeSettings = {
        use_custom_cube_colors: settings.use_custom_cube_colors.value === "true",
        values: [
            {
                key: "custom_cube_color_B",
                value: settings.custom_cube_color_B.value,
                title: settings.custom_cube_color_B.title
            },
            {
                key: "custom_cube_color_D",
                value: settings.custom_cube_color_D.value,
                title: settings.custom_cube_color_D.title
            },
            {
                key: "custom_cube_color_F",
                value: settings.custom_cube_color_F.value,
                title: settings.custom_cube_color_F.title
            },
            {
                key: "custom_cube_color_L",
                value: settings.custom_cube_color_L.value,
                title: settings.custom_cube_color_L.title
            },
            {
                key: "custom_cube_color_R",
                value: settings.custom_cube_color_R.value,
                title: settings.custom_cube_color_R.title
            },
            {
                key: "custom_cube_color_U",
                value: settings.custom_cube_color_U.value,
                title: settings.custom_cube_color_U.title
            },
        ]
    }

    let pyraminxSettings = {
        use_custom_pyraminx_colors: settings.use_custom_pyraminx_colors.value === "true",
        values: [
            {
                key: "custom_pyra_color_D",
                value: settings.custom_pyra_color_D.value,
                title: settings.custom_pyra_color_D.title
            },
            {
                key: "custom_pyra_color_F",
                value: settings.custom_pyra_color_F.value,
                title: settings.custom_pyra_color_F.title
            },
            {
                key: "custom_pyra_color_L",
                value: settings.custom_pyra_color_L.value,
                title: settings.custom_pyra_color_L.title
            },
            {
                key: "custom_pyra_color_R",
                value: settings.custom_pyra_color_R.value,
                title: settings.custom_pyra_color_R.title
            },
        ]
    }

    let redditSettings = {
        reddit_comp_notify: { title: "reddit_comp_notify", value: settings.reddit_comp_notify.value === "true" },
        reddit_results_notify: { title: "reddit_results_notify", value: settings.reddit_results_notify.value === "true" },
    }

    let generalSettings = {
        manual_time_entry_by_default: { title: "manual_time_entry_by_default", value: settings.manual_time_entry_by_default.value === "true" },
        use_inspection_time: { title: "use_inspection_time", value: settings.use_inspection_time.value === "true" },
        hide_inspection_time: { title: "hide_inspection_time", value: settings.hide_inspection_time.value === "true" },
        hide_running_timer: { title: "hide_running_timer", value: settings.hide_running_timer.value === "true" },
        hide_scramble_preview: { title: "hide_scramble_preview", value: settings.hide_scramble_preview.value === "true" },
        enable_moving_shapes_bg: { title: "enable_moving_shapes_bg", value: settings.enable_moving_shapes_bg.value === "true" },
    }

    return {
        cubeSettings: cubeSettings,
        megaminxSettings: megaminxSettings,
        pyraminxSettings: pyraminxSettings,
        redditSettings: redditSettings,
        generalSettings: generalSettings
    }
}

export function minifySettings(settings: Types.CleanUserSettings): Types.UserSettingsMinified {
    let minifiedSettings: { [index: string]: any } = {}

    minifiedSettings.use_custom_cube_colors = settings.cubeSettings.use_custom_cube_colors
    settings.cubeSettings.values.forEach(v => {
        minifiedSettings[v.key] = v.value
    })

    minifiedSettings.use_custom_megaminx_colors = settings.megaminxSettings.use_custom_megaminx_colors
    settings.megaminxSettings.values.forEach(v => {
        minifiedSettings[v.key] = v.value
    })

    minifiedSettings.use_custom_pyraminx_colors = settings.pyraminxSettings.use_custom_pyraminx_colors
    settings.pyraminxSettings.values.forEach(v => {
        minifiedSettings[v.key] = v.value
    })

    Object.keys(settings.generalSettings).forEach(k => {
        minifiedSettings[k] = settings.generalSettings[k].value
    })

    Object.keys(settings.redditSettings).forEach(k => {
        minifiedSettings[k] = settings.redditSettings[k].value
    })

    return minifiedSettings as Types.UserSettingsMinified
}

export function minifyRawSettings(settings: Types.UserSettings): Types.UserSettingsMinified {
    let s = cleanSettings(settings)
    return minifySettings(s)
}