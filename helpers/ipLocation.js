async function getLocation(ip) {
  try {
    let targetIp = ip

    if (
      !targetIp ||
      targetIp === '::1' ||
      targetIp === '127.0.0.1' ||
      targetIp === '::ffff:127.0.0.1'
    ) {
      const ipRes = await fetch('https://api.ipify.org?format=json')
      const ipData = await ipRes.json()
      targetIp = ipData.ip
    }

    const locRes = await fetch(`http://ip-api.com/json/${targetIp}`)
    const locData = await locRes.json()

    return {
      ipAddress: targetIp,
      city: locData.city || 'Unknown',
      region: locData.regionName || 'Unknown',
      country: locData.country || 'Unknown'
    }
  } catch (err) {
    console.log('IP LOCATION ERROR:', err.message)
    return {
      ipAddress: ip,
      city: 'Unknown',
      region: 'Unknown',
      country: 'Unknown'
    }
  }
}

module.exports = { getLocation }