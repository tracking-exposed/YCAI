import { CustomTypeOptions } from 'react-i18next';

const resources: CustomTypeOptions['resources'] = {
  title: 'YouChoose AI',
  common: {
    coming_soon: 'Coming soon',
    empty_list: 'No {{resource}} found.',
  },
  actions: {
    popup_bootstrap: 'Bootstrap',
    add: 'Add',
    copied: 'Copied!',
    drag_drop_recommendations: 'Drag and drop to change the order of appearance',
    manage_recommendations: 'Manage recommendations',
    link_channel: 'Link channel',
    unlink_channel: 'Unlink channel',
    delete: 'Delete',
    clear: 'Clear',
    editThisVideo: 'Edit this video',
    importVideos: 'Import videos',
    addToCurrentVideo: 'Add to current video',
    removeFromCurrentVideo: 'Remove from current video',
    compare: 'Compare',
    related: 'Related',
    next: 'Next',
    verify_channel: 'Verify',
    generate_keypair: 'Generate keypair',
    refresh_keypair: 'Refresh keypair',
    delete_keypair: 'Delete keypair',
    download_keypair: 'Download keypair',
    pull_creator_videos: 'Import your videos',
    update_creator_videos_list: 'Update your list of videos',
    copy_verification_code: 'Copy code',
    unlink_profile: 'Unlink profile',
    edit_access_token: 'Edit Access Token',
    download_access_token: 'Download Access Token',
    download: 'Download'
  },
  routes: {
    lab_title: 'LAB - Recommend on your videos',
    lab_title_short: 'LAB',
    lab_subtitle: 'Select a video and highlight content from all over the Internet',
    lab_edit_subtitle: 'Highlight content related to this video from anywhere on the Internet',
    statistics: 'Statistics',
    settings: 'Settings',
    link_account: 'Link your YouTube Channel to start recommending on your videos',
  },
  account: {
    channel: 'Your channel',
  },
  creator: {
    title: 'Creator',
  },
  hide_all: {
    title: 'Hide All',
  },
  link_account: {
    title: 'Link your account',
    subtitle: 'Our system will verify that you own the channel on this browser',
    label: 'Link your account to start choosing recommendations',
    copy_verification_key: 'Copy and paste this unique key in your channel\'s description',
    verification_code_hint:
      "Paste and publish a new channel description containing the above code on <1>YouTube Studio</1>. You can remove the code from your channel's description after the verification is complete.",
    paste_channel_url: 'Paste your YouTube Channel\'s URL or ID',
    verification_failed: 'Oh no, the channel verification failed!',
    verification_failed_hint: "Please double-check that you have published the code in your channel's description and try again.",
    go_back_to_step_one_hint: 'If the verification keeps failing, <1>go back to step one</1> and make sure you have pasted the correct URL to your YouTube channel.',
  },
  youtube: {
    title: 'Youtube',
  },
  recommendations: {
    added_to_video_title: 'Recommendations added',
    by_creator_title: 'Author\'s recommendations',
    total: 'Total recommendations',
    url: 'Recommendation url',
    yours: 'Your recommendations',
    no_items: 'Recommendations will appear here once added!',
    add_to_video: 'Add a recommendation to this video',
    url_placeholder: 'https://youtube.com/watch?v=xxxxx',
    url_helper_text: 'Insert a link',
  },
  dashboard: { title: 'Dashboard' },
  popup: { version: 'version {{version}} build {{data}}' },
  statistics: {
    title: 'Statistics',
    subtitle: 'Statistics computed with resources from other users',
    recommendability_score_title: 'Recommendability Score',
    recommendability_score_subtitle:
      'Where your videos appears as recommended?',
    total_views: 'Total Views',
    total_recommendations: 'Total Recommendations',
    evidences_title: 'Evidences',
    notifications_title: 'Notifications',
    top_n_cc_related_to_your_channel:
      'Top {{count}} CC related to your channel',
    advertising_connected_to_your_videos:
      'Advertising connected to your videos',
  },
  videos: {
    no_results: 'No videos found.',
    no_selected: 'No video selected',
    no_video_id: 'No video id found',
  },
  settings: {
    contentCreatorRecommendationLabel: 'Content Creators',
    contentCreatorRecommendationHint: 'See suggestions by real authors',
    communityRecommendationsLabel: 'Community',
    communityRecommendationsHint: 'Coming soon 🌻',
    contributeToIndependentStatsLabel: 'Independent stats',
    contributeToIndependentStatsHint:
      'Donate anonymously what Youtube recommends and advertises you',
    api_list_title: 'API List',
    encrypted_contributions_private_key: 'You can download your private key in dashboard.',
    keypair_passphrase: 'Key pair passphrase',
    keypair_private_key: 'Key pair secret key',
    keypair_public_key: 'Key pair public key',
    keypair_title: 'Keypair for independent contribution',
    access_token_title: 'You Access Token',
    access_token: 'Access Token'
  },
  ytVideoPage: {
    firstTab: 'Creator Recommendations',
    secondTab: 'Community Recommendations',
    thirdTab: 'Youtube Recommendations',
  },
};

export default resources;
