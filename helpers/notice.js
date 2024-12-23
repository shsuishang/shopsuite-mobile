function addNotification(e, t, n)
{
    if (e && t)
    {
        n || console.log("addNotification Warning: no observer will can't remove notice");
        var r = {name: e, selector: t, observer: n};
        addNotices(r)
    }
    else
    {
        console.log("addNotification error: no selector or name")
    }
}
function addNotices(e)
{
    __notices.push(e)
}
function removeNotification(e, t)
{
    for (var n = 0; n < __notices.length; n++)
    {
        var r = __notices[n];
        if (r.name === e && r.observer === t)
        {
            __notices.splice(n, 1);
            return
        }
    }
}
function postNotificationName(e, t)
{
    if (__notices.length == 0)
    {
        console.log("postNotificationName error: u hadn't add any notice.");
        return
    }
    for (var n = 0; n < __notices.length; n++)
    {
        var r = __notices[n];
        r.name === e && r.selector(t)
    }
}
function cmp(e, t)
{
    if (e === t)
    {
        return !0;
    }
    if (e instanceof Object && t instanceof Object)
    {
        if (e.constructor !== t.constructor)
        {
            return !1;
        }
        for (var n in e)
        {
            if (e.hasOwnProperty(n))
            {
                if (!t.hasOwnProperty(n))
                {
                    return !1;
                }
                if (e[n] === t[n])
                {
                    continue;
                }
                if (typeof e[n] != "object")
                {
                    return !1;
                }
                if (!Object.equals(e[n], t[n]))
                {
                    return !1
                }
            }
        }
        for (n in t)
        {
            if (t.hasOwnProperty(n) && !e.hasOwnProperty(n))
            {
                return !1;
            }
        }
        return !0
    }
    return !1
}

var __notices = [], isDebug = !0;

export default {
    addNotification: addNotification,
    removeNotification: removeNotification,
    postNotificationName: postNotificationName
};