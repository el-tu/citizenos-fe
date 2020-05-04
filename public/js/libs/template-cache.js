/** AUTOGENERATED BY GULP templatecache TASK **/ 

angular
    .module('citizenos')
    .run(['$log', '$http', '$templateCache', function ($log, $http, $templateCache) {
        var templates = [
            '/views/401.html',
            '/views/404.html',
            '/views/home.html',
            '/views/my.html',
            '/views/my_groups_groupId.html',
            '/views/my_topics_topicId.html',
            '/views/partners_consent.html',
            '/views/partners_login.html',
            '/views/topics_topicId.html',
            '/views/topics_topicId_comments.html',
            '/views/topics_topicId_mentions.html',
            '/views/unknown_device.html',
            '/views/default/nav.html',
            '/views/default/nav_mobile.html',
            '/views/default/search.html',
            '/views/directives/cos_modal.html',
            '/views/directives/cos_modal_datepicker.html',
            '/views/directives/date_picker.html',
            '/views/layouts/main.html',
            '/views/layouts/partner.html',
            '/views/layouts/widget.html',
            '/views/modals/activity_modal.html',
            '/views/modals/cookie_control.html',
            '/views/modals/group_create_settings.html',
            '/views/modals/group_delete_confirm.html',
            '/views/modals/group_member_topic_delete_confirm.html',
            '/views/modals/group_member_user_delete_confirm.html',
            '/views/modals/group_member_user_leave_confirm.html',
            '/views/modals/languages.html',
            '/views/modals/login.html',
            '/views/modals/login_esteid.html',
            '/views/modals/login_smartid.html',
            '/views/modals/my_account.html',
            '/views/modals/notification.html',
            '/views/modals/password_forgot.html',
            '/views/modals/password_reset.html',
            '/views/modals/privacy_policy.html',
            '/views/modals/sign_up.html',
            '/views/modals/topic_attachment_delete_confirm.html',
            '/views/modals/topic_attachments.html',
            '/views/modals/topic_close_confirm.html',
            '/views/modals/topic_comment_moderate.html',
            '/views/modals/topic_comment_report.html',
            '/views/modals/topic_delete_comment.html',
            '/views/modals/topic_delete_confirm.html',
            '/views/modals/topic_delete_reply.html',
            '/views/modals/topic_event_delete_confirm.html',
            '/views/modals/topic_invite_user_delete_confirm.html',
            '/views/modals/topic_member_group_delete_confirm.html',
            '/views/modals/topic_member_user_delete_confirm.html',
            '/views/modals/topic_member_user_leave_confirm.html',
            '/views/modals/topic_report.html',
            '/views/modals/topic_reports_reportId.html',
            '/views/modals/topic_reports_reportId_moderate.html',
            '/views/modals/topic_reports_reportId_resolve.html',
            '/views/modals/topic_reports_reportId_review.html',
            '/views/modals/topic_send_to_followUp_confirm.html',
            '/views/modals/topic_send_to_vote_confirm.html',
            '/views/modals/topic_settings.html',
            '/views/modals/topic_topicId_invites_users_inviteId.html',
            '/views/modals/topic_vote_delegate.html',
            '/views/modals/topic_vote_revoke_delegation_confirm.html',
            '/views/modals/topic_vote_sign.html',
            '/views/modals/topic_vote_sign_esteid.html',
            '/views/modals/topic_vote_sign_smartid.html',
            '/views/modals/user_delete_confirm.html',
            '/views/modals/widgets_how_it_works.html',
            '/views/widgets/activities.html',
        ];
        var i = 0;
        if (templates.length) {
            downloadToCache();
        }
        function downloadToCache() {
            var template = templates[i];
            $http
                .get(template, {
                    ignoreLoadingBar: true
                })
                .then(
                    function (response) {
                        $templateCache.put(response.config.url, response.data);
                        if (++i < templates.length) {
                            downloadToCache();
                        }
                    },
                    function (err) {
                        $log.error('error', err);
                        if (++i < templates.length) {
                            downloadToCache();
                        }
                    }
                );
        }
    }]);