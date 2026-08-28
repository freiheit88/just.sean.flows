import os
import json

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT_DIR = os.path.join(BASE_DIR, "notebooklm_sources")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# 1. HESSEN EU GRANT & B2B PROPOSAL DOSSIER
grant_b2b_doc = """# [JUST SEAN FLOWS] 06. German Hessen State Digital Grants & Frankfurt B2B Sonic Branding Proposal

## 1. Hessen Digitalbonus & EU Funding Pipeline (Non-dilutive €130,000)
- **Target Grant 1: Hessen Digitalbonus (Wirtschafts- und Infrastrukturbank Hessen - WIBank)**
  * Maximum Grant: €10,000 (Standard) to €50,000 (Digital Innovation Plus)
  * Subsidy Rate: 50% non-repayable cash grant for digital creative tech architectures.
  * Eligible Project Scope: Cloud-based 432Hz interactive CADENZA score player, 3D WebGL spatial showcase, and AI-driven sonic algorithmic branding.
- **Target Grant 2: Initiative Musik & Deutscher Musikrat / Musikfonds**
  * Maximum Grant: Up to €50,000 for innovative contemporary acoustic productions.
  * Qualification: 432Hz scientific Verdi tuning, neo-classical chamber integration, and multilingual digital archive.
- **Target Grant 3: EIT Culture & Creativity (European Union)**
  * Maximum Allocation: Up to €30,000 for cross-border European luxury digital experiences.

## 2. Frankfurt Corporate Client Sonic Branding Offer (€12,000 Package)
- **Target Industries**: Frankfurt Private Banks, Luxury Real Estate Developers (Mainhattan Skylines), Boutique Hotels, Fine Wine & Champagne Ateliers.
- **Cost Structure**:
  * 1) 432Hz Custom Audio Signature & Sonic Logo Creation: €4,500
  * 2) 3D Interactive Web Showcase & Dynamic Waveform Engine: €5,250
  * 3) On-site Hardware Calibration & Sound Engineering (15 hrs @ €150/hr): €2,250
  * **Total Proposal Amount**: €12,000 + VAT (19% MwSt.)
- **B2B Licensing Model**:
  * Perpetual Commercial License (DACH Region: Germany, Austria, Switzerland)
  * Annual Sync & Maintenance Extension: €2,400 / year
"""

with open(os.path.join(OUTPUT_DIR, "06_Hessen_Grants_and_B2B_Proposals.md"), "w", encoding="utf-8") as f:
    f.write(grant_b2b_doc)

# 2. FINANCIAL DATASET & CSV MODEL
financial_csv = """Category,Item,Quantity,Unit_Price_EUR,Total_EUR,Recurring_Frequency,Notes
B2B Proposal,Sonic Logo Composition,1,4500,4500,One-time,432Hz Verdi tuned master identity
B2B Proposal,Interactive 3D Web Engine,1,5250,5250,One-time,Three.js WebGL & DSP Waveform
B2B Proposal,Acoustic Engineering Support,15,150,2250,One-time,On-site studio & spatial tuning
B2B Proposal,Annual Maintenance & Sync,1,2400,2400,Annual,Cloud streaming & catalog sync
Passive Revenue,Active Streaming Tracks,300,0.0033,14850,Monthly,500 daily plays/track @ 30 days
Grant Pipeline,Hessen Digitalbonus WIBank,1,50000,50000,Non-dilutive,Hessen state government grant
Grant Pipeline,Bundes Musikfonds,1,50000,50000,Non-dilutive,Federal contemporary music grant
Grant Pipeline,EU EIT Culture & Creativity,1,30000,30000,Non-dilutive,European cross-border innovation
Couture Lookbook,Cashmere Scarf Bordeaux,100,280,28000,Inventory,100% Mongolian Cashmere
Couture Lookbook,18K Tuning Fork Pendant,50,650,32500,Inventory,Solid 18K Gold engraved 432Hz
Couture Lookbook,Calfskin Messenger Bag,30,1200,36000,Inventory,Handcrafted in Offenbach
VIP Event,October Party VIP Tickets,100,350,35000,Event,All-inclusive Grand Cru & Concert
"""

with open(os.path.join(OUTPUT_DIR, "07_Sonic_Branding_Financial_Model.csv"), "w", encoding="utf-8") as f:
    f.write(financial_csv)

# 3. OCTOBER 2026 VIP PARTY RUN-DOWN & GUEST SCENARIO
party_rundown_doc = """# [JUST SEAN FLOWS] 08. October 2026 Frankfurt VIP Launch Party Master Run-down

## 1. Event Overview
- **Event Title**: "432Hz Sanctuary — An Evening of Velvet & Gold"
- **Date & Time**: Friday, October 23, 2026 | 19:30 - 01:00 CEST
- **Venue**: Historical Secret Salon, Altstadt Frankfurt am Main
- **Guest Capacity**: 100 Exclusive Guests (Instagram VIPs, Art Collectors, Tech Founders, Press)
- **Dress Code**: Black Velvet Black-Tie & 18K Gold Chiaroscuro

## 2. Minute-by-Minute Run-down
- **19:30 - 20:15 | Welcome & Instagram VIP Gate Check-in**
  * Entrance through the brass gate (Matching Web Stage 3).
  * Guests scan their mobile VIP Token / Instagram QR Code for instant physical badge issuance.
  * Welcome Drink: Champagne Grand Cru paired with 432Hz ambient binaural soundscape.

- **20:15 - 21:00 | Act I: The Frankfurt Walk Live Simulation**
  * Stage immersion: Live 1st-person visual projection of the 7-stage Frankfurt midnight walk.
  * Musical Performance: Guarneri 1780 Violin solo ("Capriccio in A minor Op. 1").

- **21:00 - 22:00 | Act II: Steinway Grand Piano & "A Twelve-minute Alibi" Premiere**
  * Live Steinway Concert D Performance.
  * Full acoustic string quartet backing.
  * Live CADENZA-432 interactive score projection on the salon walls.

- **22:00 - 23:30 | Act III: Couture Lookbook Private Salon & Tasting**
  * 14-piece editorial capsule lookbook live exhibition.
  * Private Member Vault tasting lounge open (2018 Bordeaux Grand Cru).

- **23:30 - 01:00 | Late-Night Chiaroscuro Lounge & Networking**
  * Low-tempo ambient deep house tuned to 432Hz.
"""

with open(os.path.join(OUTPUT_DIR, "08_October_Party_Master_Rundown.md"), "w", encoding="utf-8") as f:
    f.write(party_rundown_doc)

print("Generated 06, 07, 08 specialized dossiers in notebooklm_sources/!")
