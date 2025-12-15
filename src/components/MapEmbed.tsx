const MapEmbed = ({ address }: { address: string }) => {
    const src = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`

    return (
        <iframe
            src={src}
            width="100%"
            height="180"
            style={{ border: 0, borderRadius: 12 }}
            loading="lazy"
        />
    )
}
export default MapEmbed