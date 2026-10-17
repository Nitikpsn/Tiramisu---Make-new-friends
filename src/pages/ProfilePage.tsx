import { useEffect, useState } from 'react'
import { Check, Globe2, Lock, MapPin, Pencil, ShieldCheck, UserRound } from 'lucide-react'
import { Avatar } from '../components/Brand'
import { InterestPill, PageHeader, PrimaryButton, SavedNotice } from '../components/UI'
import { useAuth } from '../lib/AuthContext'
import { supabase } from '../lib/supabase'
import { navigateTo } from '../lib/utils'

type ProfilePreferences = {
  name: string
  bio: string
  interests: string[]
  visibility: string
  locationSharing: boolean
  notificationsEnabled: boolean
}

const defaultBio = 'Collecting tiny joys and people who make ordinary plans feel worth showing up for.'

function readProfile(key: string, fallback: ProfilePreferences): ProfilePreferences {
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(key) ?? 'null')
    if (typeof value === 'object' && value !== null && 'name' in value && 'bio' in value &&
      'interests' in value && 'visibility' in value && 'locationSharing' in value &&
      'notificationsEnabled' in value && typeof value.name === 'string' &&
      typeof value.bio === 'string' && Array.isArray(value.interests) &&
      value.interests.every((interest) => typeof interest === 'string') &&
      typeof value.visibility === 'string' && typeof value.locationSharing === 'boolean' &&
      typeof value.notificationsEnabled === 'boolean') {
      return {
        name: value.name,
        bio: value.bio,
        interests: value.interests,
        visibility: value.visibility,
        locationSharing: value.locationSharing,
        notificationsEnabled: value.notificationsEnabled,
      }
    }
  } catch (error) {
    console.warn('Unable to load the saved profile.', error)
  }
  return fallback
}

export function ProfilePage() {
  const { user, signOut } = useAuth()
  const profileKey = `tiramisu-profile:${user?.id ?? 'demo'}`
  const [profile, setProfile] = useState<ProfilePreferences>(() => readProfile(profileKey, {
    name: user?.user_metadata?.display_name ?? user?.email?.split('@')[0] ?? 'Your name',
    bio: defaultBio,
    interests: ['Design', 'Good food', 'Indie music', 'Long walks'],
    visibility: 'Community',
    locationSharing: false,
    notificationsEnabled: true,
  }))
  const [savedProfile, setSavedProfile] = useState(profile)
  const [interestsInput, setInterestsInput] = useState(profile.interests.join(', '))
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user || !supabase) return
    let active = true
    void supabase.from('profiles').select('display_name, bio, interests, visibility, location_sharing').eq('id', user.id).maybeSingle().then(({ data }) => {
      if (!active || !data) return
      const nextProfile: ProfilePreferences = {
        name: data.display_name || profile.name,
        bio: data.bio || '',
        interests: Array.isArray(data.interests) ? data.interests : [],
        visibility: data.visibility || 'Community',
        locationSharing: Boolean(data.location_sharing),
        notificationsEnabled: profile.notificationsEnabled,
      }
      setProfile(nextProfile)
      setSavedProfile(nextProfile)
      setInterestsInput(nextProfile.interests.join(', '))
      window.localStorage.setItem(profileKey, JSON.stringify(nextProfile))
    })
    return () => { active = false }
  }, [profileKey, user])

  async function persistProfile(nextProfile: ProfilePreferences) {
    window.localStorage.setItem(profileKey, JSON.stringify(nextProfile))
    if (!user || !supabase) return
    const { error: saveError } = await supabase.from('profiles').upsert({
      id: user.id,
      display_name: nextProfile.name.trim(),
      bio: nextProfile.bio.trim(),
      interests: nextProfile.interests,
      visibility: nextProfile.visibility,
      location_sharing: nextProfile.locationSharing,
    })
    if (saveError) throw saveError
  }

  async function save() {
    const nextProfile = {
      ...profile,
      interests: interestsInput.split(',').map((interest) => interest.trim()).filter(Boolean),
    }
    try {
      await persistProfile(nextProfile)
      setProfile(nextProfile)
      setSavedProfile(nextProfile)
      setInterestsInput(nextProfile.interests.join(', '))
      setError('')
      setEditing(false)
      setSaved(true)
      window.setTimeout(() => setSaved(false), 2400)
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Your profile could not be saved.')
    }
  }

  function cancelEdit() {
    setProfile(savedProfile)
    setInterestsInput(savedProfile.interests.join(', '))
    setEditing(false)
    setError('')
  }

  async function savePreference(nextProfile: ProfilePreferences) {
    setProfile(nextProfile)
    setSavedProfile(nextProfile)
    try {
      await persistProfile(nextProfile)
      setError('')
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Your preference could not be saved.')
    }
  }

  async function logout() {
    const result = await signOut()
    if (result.error) {
      setError(result.error)
      return
    }
    navigateTo('/login')
  }

  const initials = profile.name.split(/\s+/).filter(Boolean).map((part) => part[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="page-content profile-page">
      <PageHeader
        eyebrow="Your little corner of Tiramisu"
        title="Profile"
        description="A few details help the right people recognize the right energy."
        action={saved
          ? <SavedNotice>Saved on this device</SavedNotice>
          : <button className="edit-toggle" onClick={() => editing ? cancelEdit() : setEditing(true)}><Pencil size={15} /> {editing ? 'Cancel editing' : 'Edit profile'}</button>}
      />
      {error && <p className="profile-error" role="alert">{error}</p>}
      <div className="profile-layout">
        <section className="profile-hero-card">
          <div className="profile-cover">
            <div className="cover-spark cover-spark-one">✦</div>
            <div className="cover-spark cover-spark-two">✦</div>
            <div className="cover-orbit" />
          </div>
          <div className="profile-hero-body">
            <div className="profile-avatar-wrap">
              <Avatar initials={initials || 'TN'} avatarClass="avatar-violet" size="lg" online />
            </div>
            <div className="profile-hero-copy">
              <span className="profile-eyebrow"><i /> {profile.visibility === 'Private' ? 'Private profile' : 'Visible to your community'}</span>
              {editing
                ? <input aria-label="Your name" className="profile-name-input" value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} />
                : <h2>{profile.name}</h2>}
              <span>{user?.email ?? 'Read-only demo profile'}</span>
            </div>
            <div className="profile-hero-action"><span className="profile-spark-count"><span>✦</span> 12 sparks</span></div>
          </div>
          <div className="profile-form-body">
            <label className="field">
              <span>Short bio</span>
              {editing
                ? <textarea aria-label="Short bio" value={profile.bio} onChange={(event) => setProfile({ ...profile, bio: event.target.value })} rows={3} />
                : <p className="profile-readonly">{profile.bio}</p>}
            </label>
            <label className="field">
              <span>Your interests</span>
              {editing
                ? <input className="interest-input" aria-label="Your interests, separated by commas" value={interestsInput} onChange={(event) => setInterestsInput(event.target.value)} placeholder="Design, food, music" />
                : <span className="interest-list profile-interests">{profile.interests.map((interest) => <InterestPill key={interest}>{interest}</InterestPill>)}</span>}
            </label>
            {editing && <PrimaryButton onClick={save}>Save profile</PrimaryButton>}
          </div>
        </section>
        <aside className="settings-stack">
          <section className="settings-card">
            <div className="settings-card-head"><div><span className="eyebrow"><ShieldCheck size={13} /> Boundaries, by you</span><h2>Privacy & visibility</h2></div></div>
            <div className="setting-row">
              <span className="setting-icon"><Globe2 size={17} /></span>
              <span><strong>Profile visibility</strong><small>Who can discover you in Tiramisu</small></span>
              <select aria-label="Profile visibility" value={profile.visibility} onChange={(event) => savePreference({ ...profile, visibility: event.target.value })}>
                <option>Community</option><option>Only people I message</option><option>Private</option>
              </select>
            </div>
            <div className="setting-row">
              <span className="setting-icon"><MapPin size={17} /></span>
              <span><strong>Approximate location</strong><small>Never shares your exact home location</small></span>
              <button type="button" className={`toggle ${profile.locationSharing ? 'is-on' : ''}`} onClick={() => savePreference({ ...profile, locationSharing: !profile.locationSharing })} aria-label="Toggle approximate location" aria-pressed={profile.locationSharing}><span /></button>
            </div>
            <div className="privacy-note"><Lock size={14} /><span>Tiramisu only shows a broad area when you choose to share. You can change this any time.</span></div>
          </section>
          <section className="settings-card account-card">
            <div className="settings-card-head"><div><span className="eyebrow"><UserRound size={13} /> Account</span><h2>Keep your account yours</h2></div></div>
            <div className="account-link"><span>{user ? 'Connected Supabase account' : 'Read-only demo session'}</span><Check size={16} /></div>
            <label className="setting-row notification-setting">
              <span><strong>Notifications</strong><small>Allow Tiramisu reminders on this device</small></span>
              <input type="checkbox" checked={profile.notificationsEnabled} onChange={(event) => savePreference({ ...profile, notificationsEnabled: event.target.checked })} />
            </label>
            <button className="logout-link" onClick={logout}>Log out of Tiramisu</button>
          </section>
        </aside>
      </div>
    </div>
  )
}
