export type UserSettings = {
    custom_cube_color_B: { value: string, title: string },
    custom_cube_color_D: { value: string, title: string },
    custom_cube_color_F: { value: string, title: string },
    custom_cube_color_L: { value: string, title: string },
    custom_cube_color_R: { value: string, title: string },
    custom_cube_color_U: { value: string, title: string },
    custom_mega_color_1: { value: string, title: string },
    custom_mega_color_10: { value: string, title: string },
    custom_mega_color_11: { value: string, title: string },
    custom_mega_color_12: { value: string, title: string },
    custom_mega_color_2: { value: string, title: string },
    custom_mega_color_3: { value: string, title: string },
    custom_mega_color_4: { value: string, title: string },
    custom_mega_color_5: { value: string, title: string },
    custom_mega_color_6: { value: string, title: string },
    custom_mega_color_7: { value: string, title: string },
    custom_mega_color_8: { value: string, title: string },
    custom_mega_color_9: { value: string, title: string },
    custom_pyra_color_D: { value: string, title: string },
    custom_pyra_color_F: { value: string, title: string },
    custom_pyra_color_L: { value: string, title: string },
    custom_pyra_color_R: { value: string, title: string },
    enable_moving_shapes_bg: { value: string, title: string },
    hide_inspection_time: { value: string, title: string },
    hide_running_timer: { value: string, title: string },
    hide_scramble_preview: { value: string, title: string },
    manual_time_entry_by_default: { value: string, title: string },
    use_custom_cube_colors: { value: string, title: string },
    use_custom_megaminx_colors: { value: string, title: string },
    use_custom_pyraminx_colors: { value: string, title: string },
    use_inspection_time: { value: string, title: string }
    reddit_comp_notify: { value: string, title: string }
    reddit_results_notify: { value: string, title: string }
}

export type CleanUserSettings = {
    cubeSettings: {
        use_custom_cube_colors: boolean
        values: { key: string, value: string, title: string }[]
    },
    megaminxSettings: {
        use_custom_megaminx_colors: boolean
        values: { key: string, value: string, title: string }[]
    },
    pyraminxSettings: {
        use_custom_pyraminx_colors: boolean
        values: { key: string, value: string, title: string }[]
    },
    redditSettings: {
        [index: string]: { value: boolean, title: string },
        reddit_comp_notify: { value: boolean, title: string }
        reddit_results_notify: { value: boolean, title: string }
    },
    generalSettings: {
        [index: string]: { value: boolean, title: string },
        enable_moving_shapes_bg: { value: boolean, title: string }
        hide_inspection_time: { value: boolean, title: string }
        hide_running_timer: { value: boolean, title: string }
        hide_scramble_preview: { value: boolean, title: string }
        manual_time_entry_by_default: { value: boolean, title: string }
        use_inspection_time: { value: boolean, title: string }
    }
}

export type UserSettingsMinified = {
    custom_cube_color_B: string,
    custom_cube_color_D: string,
    custom_cube_color_F: string,
    custom_cube_color_L: string,
    custom_cube_color_R: string,
    custom_cube_color_U: string,
    custom_mega_color_1: string,
    custom_mega_color_10: string,
    custom_mega_color_11: string,
    custom_mega_color_12: string,
    custom_mega_color_2: string,
    custom_mega_color_3: string,
    custom_mega_color_4: string,
    custom_mega_color_5: string,
    custom_mega_color_6: string,
    custom_mega_color_7: string,
    custom_mega_color_8: string,
    custom_mega_color_9: string,
    custom_pyra_color_D: string,
    custom_pyra_color_F: string,
    custom_pyra_color_L: string,
    custom_pyra_color_R: string,
    enable_moving_shapes_bg: boolean,
    hide_inspection_time: boolean,
    hide_running_timer: boolean,
    hide_scramble_preview: boolean,
    manual_time_entry_by_default: boolean,
    use_custom_cube_colors: boolean,
    use_custom_megaminx_colors: boolean,
    use_custom_pyraminx_colors: boolean,
    use_inspection_time: boolean
    reddit_comp_notify: boolean
    reddit_results_notify: boolean
}